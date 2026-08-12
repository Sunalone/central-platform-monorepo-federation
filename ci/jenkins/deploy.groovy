/*
 * 静态微前端部署脚本，目标服务器约定为 Linux。
 *
 * 服务器目录结构：
 *   <remoteRoot>/<environment>/<app>/
 *     current  -> releases/<releaseId>
 *     previous -> 上一个可回滚版本
 *     releases/<releaseId>/
 *
 * Jenkins 需安装 Credentials Binding 插件，并配置 SSH Username with private key 凭据。
 * Agent 还需要 ssh、scp、tar、curl，并提前维护目标服务器的 known_hosts。
 */

def validateToken(String value, String fieldName) {
  if (!value || !(value ==~ /[0-9A-Za-z._-]+/)) {
    error "Invalid ${fieldName}: ${value}"
  }
  return value
}

def validateHost(String host) {
  if (!host || !(host ==~ /[0-9A-Za-z.:-]+/)) {
    error "Invalid deploy host: ${host}"
  }
  return host
}

def validateRemoteRoot(String path) {
  // 仅允许绝对路径和常见安全字符，后续清理历史版本会在该目录下执行。
  if (!path || !(path ==~ /\/[0-9A-Za-z._\/-]+/) || path == '/') {
    error "Invalid remote root: ${path}"
  }
  return path.replaceAll('/+$', '')
}

def shellQuote(String value) {
  return "'${value.replace("'", "'\"'\"'")}'"
}

def sshCommand(String keyFile, String user, String host, int port, String remoteCommand) {
  String destination = "${user}@${host}"
  sh "ssh -i ${shellQuote(keyFile)} -p ${port} -o BatchMode=yes -o StrictHostKeyChecking=yes ${shellQuote(destination)} ${shellQuote(remoteCommand)}"
}

def uploadArchive(String keyFile, String user, String host, int port, String archive, String destination) {
  sh "scp -i ${shellQuote(keyFile)} -P ${port} -o BatchMode=yes -o StrictHostKeyChecking=yes ${shellQuote(archive)} ${shellQuote("${user}@${host}:${destination}")}"
}

def createArchive(String app, String releaseId) {
  String appName = app.tokenize('/').last()
  String distDirectory = "${app}/dist"
  String archive = ".jenkins-deploy/${appName}-${releaseId}.tar.gz"

  if (!fileExists("${distDirectory}/index.html")) {
    error "Build artifact is incomplete: ${distDirectory}/index.html does not exist."
  }

  sh "mkdir -p .jenkins-deploy && tar -czf ${shellQuote(archive)} -C ${shellQuote(distDirectory)} ."
  return archive
}

def deployApp(String app, Map options) {
  String appName = validateToken(app.tokenize('/').last(), 'app name')
  String environment = validateToken(options.environment as String, 'environment')
  String releaseId = validateToken(options.releaseId as String, 'release id')
  String host = validateHost(options.host as String)
  String remoteRoot = validateRemoteRoot(options.remoteRoot as String)
  String credentialsId = options.credentialsId as String
  int port = (options.port ?: 22) as int
  int keepReleases = (options.keepReleases ?: 5) as int
  String stashPrefix = options.stashPrefix ?: 'frontend-dist'

  if (!credentialsId) error 'credentialsId is required.'
  if (port < 1 || port > 65535) error "Invalid SSH port: ${port}"
  if (keepReleases < 2 || keepReleases > 50) error 'keepReleases must be between 2 and 50.'

  unstash "${stashPrefix}-${appName}"
  String archive = createArchive(app, releaseId)
  String appRoot = "${remoteRoot}/${environment}/${appName}"
  String releaseDirectory = "${appRoot}/releases/${releaseId}"
  String remoteArchive = "/tmp/${appName}-${releaseId}.tar.gz"

  withCredentials([sshUserPrivateKey(
    credentialsId: credentialsId,
    keyFileVariable: 'DEPLOY_SSH_KEY',
    usernameVariable: 'DEPLOY_SSH_USER',
  )]) {
    // release 目录不可覆盖，避免重复执行时把新旧文件混合到同一版本中。
    sshCommand(env.DEPLOY_SSH_KEY, env.DEPLOY_SSH_USER, host, port,
      "set -eu; test ! -e ${shellQuote(releaseDirectory)}; mkdir -p ${shellQuote(releaseDirectory)}")
    uploadArchive(env.DEPLOY_SSH_KEY, env.DEPLOY_SSH_USER, host, port, archive, remoteArchive)

    /*
     * 先保存 current 为 previous，再通过临时软链 + mv 原子替换 current。
     * Nginx 始终读取完整目录，不会暴露上传到一半的静态文件。
     */
    String activateCommand = """
      set -eu
      trap 'rm -f ${shellQuote(remoteArchive)}' EXIT
      tar -xzf ${shellQuote(remoteArchive)} -C ${shellQuote(releaseDirectory)}
      if [ -L ${shellQuote("${appRoot}/current")} ]; then
        old_release=\$(readlink ${shellQuote("${appRoot}/current")})
        ln -sfn "\$old_release" ${shellQuote("${appRoot}/previous.next")}
        mv -Tf ${shellQuote("${appRoot}/previous.next")} ${shellQuote("${appRoot}/previous")}
      fi
      ln -sfn ${shellQuote(releaseDirectory)} ${shellQuote("${appRoot}/current.next")}
      mv -Tf ${shellQuote("${appRoot}/current.next")} ${shellQuote("${appRoot}/current")}
    """.stripIndent().trim()
    sshCommand(env.DEPLOY_SSH_KEY, env.DEPLOY_SSH_USER, host, port, activateCommand)

    String healthUrl = (options.healthChecks ?: [:])[appName]
    if (healthUrl) {
      int healthStatus = sh(
        script: "curl --fail --silent --show-error --location --retry 5 --retry-delay 2 ${shellQuote(healthUrl)} > /dev/null",
        returnStatus: true,
      )
      if (healthStatus != 0) {
        echo "Health check failed for ${appName}; rolling back to previous release."
        String rollbackCommand = """
          set -eu
          if [ -L ${shellQuote("${appRoot}/previous")} ]; then
            previous_release=\$(readlink ${shellQuote("${appRoot}/previous")})
            ln -sfn "\$previous_release" ${shellQuote("${appRoot}/current.next")}
            mv -Tf ${shellQuote("${appRoot}/current.next")} ${shellQuote("${appRoot}/current")}
          else
            rm -f ${shellQuote("${appRoot}/current")}
          fi
        """.stripIndent().trim()
        sshCommand(env.DEPLOY_SSH_KEY, env.DEPLOY_SSH_USER, host, port, rollbackCommand)
        error "Deployment health check failed and ${appName} was rolled back."
      }
    }

    // 健康检查通过后再清理旧版本，current 和 previous 指向的版本会自然位于最新版本中。
    String cleanupCommand = """
      set -eu
      if [ -d ${shellQuote("${appRoot}/releases")} ]; then
        cd ${shellQuote("${appRoot}/releases")}
        ls -1dt -- */ 2>/dev/null | tail -n +${keepReleases + 1} | xargs -r rm -rf --
      fi
    """.stripIndent().trim()
    sshCommand(env.DEPLOY_SSH_KEY, env.DEPLOY_SSH_USER, host, port, cleanupCommand)
  }
}

def deployParallel(List<String> apps, Map options, String stagePrefix) {
  if (!apps) return

  Map<String, Closure> branches = [:]
  apps.each { app ->
    String currentApp = app
    String appName = currentApp.tokenize('/').last()
    branches[appName] = {
      stage("${stagePrefix}: ${appName}") {
        deployApp(currentApp, options)
      }
    }
  }
  parallel branches
}

def execute(Map options = [:]) {
  if (!isUnix()) {
    error 'Deployment requires a Linux Jenkins Agent with ssh, scp, tar and curl.'
  }

  List<String> allowedApps = [
    'apps/shell-app',
    'apps/product-center',
    'apps/protocol-center',
    'apps/payment-center',
    'apps/user-center',
  ]
  List<String> apps = (options.apps ?: []) as List<String>
  List<String> unknownApps = apps.findAll { !allowedApps.contains(it) }
  if (unknownApps) error "Unknown deploy apps: ${unknownApps.join(', ')}"
  if (!apps) {
    echo 'No application artifact needs deployment.'
    return
  }

  Map deployOptions = options + [
    releaseId: options.releaseId ?: "${env.BUILD_NUMBER ?: 'local'}-${env.GIT_COMMIT?.take(8) ?: 'unknown'}",
  ]
  List<String> remotes = apps.findAll { it != 'apps/shell-app' }
  List<String> shell = apps.findAll { it == 'apps/shell-app' }

  // 先发布 remote，全部成功后再切换 shell，避免 shell 引用尚未就绪的远程模块。
  deployParallel(remotes, deployOptions, 'Deploy remote')
  deployParallel(shell, deployOptions, 'Deploy shell')
}

return this
