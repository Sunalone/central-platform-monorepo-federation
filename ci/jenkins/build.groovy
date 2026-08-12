/*
 * Monorepo 构建编排脚本。
 *
 * 推荐在 Jenkinsfile 的 script 块中调用：
 *   def monorepo = load 'ci/jenkins/monorepo.groovy'
 *   def builder = load 'ci/jenkins/build.groovy'
 *   def result = builder.execute(monorepo: monorepo)
 *
 * 返回值格式：
 *   [targets: ['packages/ui', ...], apps: ['apps/product-center', ...]]
 */

def resolveTargets(def monorepo, Map options) {
  if (options.containsKey('targets')) {
    List<String> targets = options.targets as List<String>
    List<String> unknownTargets = targets.findAll { !monorepo.allTargets().contains(it) }
    if (unknownTargets) {
      error "Unknown build targets: ${unknownTargets.join(', ')}"
    }
    return targets
  }

  String baseRef = options.baseRef ?: monorepo.defaultBaseRef()
  String headRef = options.headRef ?: 'HEAD'
  return monorepo.detectAffectedTargets(baseRef, headRef)
}

def stashApplications(def monorepo, List<String> targets, String stashPrefix) {
  List<String> apps = monorepo.workspaceApps().findAll { targets.contains(it) }

  apps.each { app ->
    String appName = app.tokenize('/').last()
    // stash 保留 apps/<name>/dist 目录结构，部署脚本可直接按 app 取出产物。
    stash(
      name: "${stashPrefix}-${appName}",
      includes: "${app}/dist/**",
      useDefaultExcludes: false,
      allowEmpty: false,
    )
  }
  return apps
}

def writeBuildMetadata(List<String> targets, List<String> apps) {
  String content = [
    "BUILD_NUMBER=${env.BUILD_NUMBER ?: ''}",
    "GIT_COMMIT=${env.GIT_COMMIT ?: ''}",
    "TARGETS=${targets.join(',')}",
    "APPS=${apps.join(',')}",
  ].join('\n') + '\n'

  writeFile file: '.jenkins-build-metadata', text: content, encoding: 'UTF-8'
  archiveArtifacts artifacts: '.jenkins-build-metadata', fingerprint: true
}

def execute(Map options = [:]) {
  def monorepo = options.monorepo ?: load('ci/jenkins/monorepo.groovy')
  String stashPrefix = options.stashPrefix ?: 'frontend-dist'
  List<String> targets = resolveTargets(monorepo, options)

  stage('Environment') {
    monorepo.verifyEnvironment()
  }

  stage('Install dependencies') {
    monorepo.installDependencies(extraArgs: options.installArgs ?: '--ignore-scripts')
  }

  if (!targets) {
    echo 'No affected workspace target; build pipeline finished without artifacts.'
    writeBuildMetadata([], [])
    return [targets: [], apps: []]
  }

  stage('Quality checks') {
    monorepo.checkTargets(targets)
  }

  stage('Build') {
    Map<String, String> buildEnvironment = (options.buildEnvironment ?: [:]) as Map<String, String>
    List<String> environmentVariables = buildEnvironment.collect { key, value ->
      if (!(key ==~ /[A-Z_][A-Z0-9_]*/)) {
        error "Invalid build environment variable: ${key}"
      }
      return "${key}=${value}"
    }

    // 可按环境覆盖 shell remote 地址；未传入时使用 vite.config.ts 的同源生产默认值。
    withEnv(environmentVariables) {
      monorepo.buildTargets(targets)
    }
  }

  List<String> apps = []
  stage('Collect artifacts') {
    apps = stashApplications(monorepo, targets, stashPrefix)
    if (options.archiveArtifacts != false) {
      monorepo.archiveAppArtifacts(targets)
    }
    writeBuildMetadata(targets, apps)
  }

  return [targets: targets, apps: apps]
}

return this
