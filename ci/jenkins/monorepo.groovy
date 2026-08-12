/*
 * pnpm monorepo 的 Jenkins Pipeline 公共方法。
 *
 * 在根目录 Jenkinsfile 中通过 load 加载：
 *   def monorepo = load 'ci/jenkins/monorepo.groovy'
 *   monorepo.verifyEnvironment()
 *   monorepo.installDependencies()
 *   def targets = monorepo.detectAffectedTargets()
 *   monorepo.checkTargets(targets)
 *   monorepo.buildTargets(targets)
 */

// 可独立构建和发布的微前端应用。新增 app 后需同步维护此列表。
def workspaceApps() {
  return [
    'apps/shell-app',
    'apps/product-center',
    'apps/protocol-center',
    'apps/payment-center',
    'apps/user-center',
  ]
}

// 仓库内的公共包。列表顺序也是公共包默认的展示和执行顺序。
def workspacePackages() {
  return [
    'packages/charts',
    'packages/cli',
    'packages/tools',
    'packages/ui',
  ]
}

/*
 * 公共包到业务应用的依赖传播关系。
 * 当公共包发生变化时，除构建公共包自身外，还需要验证所有依赖它的 app。
 */
def packageDependents() {
  return [
    'packages/charts': [
      'apps/product-center',
      'apps/protocol-center',
      'apps/payment-center',
      'apps/user-center',
    ],
    'packages/tools': [
      'apps/protocol-center',
    ],
    'packages/ui': [
      'apps/product-center',
      'apps/protocol-center',
      'apps/payment-center',
      'apps/user-center',
    ],
  ]
}

def allTargets() {
  return workspacePackages() + workspaceApps()
}

/*
 * 统一 Linux/Windows Jenkins Agent 的命令调用，并显式设置 CI=true，
 * 防止 pnpm 在无交互终端中等待确认。
 */
def runCommand(String command) {
  withEnv(['CI=true']) {
    if (isUnix()) {
      sh command
    } else {
      bat "@${command}"
    }
  }
}

// 执行命令并返回标准输出，主要用于读取 git diff 结果。
def commandOutput(String command) {
  return withEnv(['CI=true']) {
    if (isUnix()) {
      return sh(script: command, returnStdout: true).trim()
    }
    return bat(script: "@${command}", returnStdout: true).trim()
  }
}

// 仅获取退出码，不因命令失败直接终止 Pipeline。
def commandStatus(String command) {
  return withEnv(['CI=true']) {
    if (isUnix()) {
      return sh(script: command, returnStatus: true)
    }
    return bat(script: "@${command}", returnStatus: true)
  }
}

def verifyEnvironment() {
  echo 'Checking Node.js and pnpm versions...'
  runCommand('node --version')
  runCommand('pnpm --version')
}

def installDependencies(Map options = [:]) {
  // Jenkins 构建必须严格使用已提交的锁文件，保证每次安装结果一致。
  String extraArgs = options.extraArgs ?: '--ignore-scripts'
  runCommand("pnpm install --frozen-lockfile ${extraArgs}".trim())
}

/*
 * PR 构建优先与目标分支比较；普通分支优先与上次成功提交比较；
 * 首次构建没有历史记录时回退到前一个提交。
 */
def defaultBaseRef() {
  if (env.CHANGE_TARGET?.trim()) {
    return "origin/${env.CHANGE_TARGET.trim()}"
  }
  if (env.GIT_PREVIOUS_SUCCESSFUL_COMMIT?.trim()) {
    return env.GIT_PREVIOUS_SUCCESSFUL_COMMIT.trim()
  }
  return 'HEAD~1'
}

// Git ref 会拼入 shell 命令，因此只允许安全字符，避免命令注入。
def validateGitRef(String ref) {
  if (!(ref ==~ /[0-9A-Za-z._\/-]+/)) {
    error "Invalid Git ref: ${ref}"
  }
  return ref
}

def changedFiles(String baseRef = defaultBaseRef(), String headRef = 'HEAD') {
  String safeBaseRef = validateGitRef(baseRef)
  String safeHeadRef = validateGitRef(headRef)

  // 浅克隆或首次构建可能没有基线提交，此时宁可全量构建也不能漏构建。
  if (commandStatus("git rev-parse --verify ${safeBaseRef}^{commit}") != 0) {
    echo "Base ref ${safeBaseRef} is unavailable; using a full build."
    return ['__ALL__']
  }

  String output = commandOutput("git diff --name-only ${safeBaseRef}...${safeHeadRef}")
  if (!output) return []
  return output.readLines().collect { it.trim().replace('\\', '/') }.findAll { it }
}

// 根配置、锁文件和 CI 脚本会影响整个工作区，修改后触发全量构建。
def isGlobalBuildFile(String file) {
  List<String> exactFiles = [
    '.npmrc',
    'Jenkinsfile',
    'eslint.config.js',
    'package.json',
    'pnpm-lock.yaml',
    'pnpm-workspace.yaml',
    'tsconfig.base.json',
  ]
  return exactFiles.contains(file) || file.startsWith('ci/') || file.startsWith('scripts/')
}

// 将 apps/foo/src/a.ts 归属到 apps/foo，将 packages/bar/src/b.ts 归属到 packages/bar。
def targetForFile(String file) {
  List<String> segments = file.tokenize('/')
  if (segments.size() < 2 || !['apps', 'packages'].contains(segments[0])) return null
  return "${segments[0]}/${segments[1]}"
}

def resolveAffectedTargets(List<String> files) {
  if (files.contains('__ALL__') || files.any { isGlobalBuildFile(it) }) {
    return allTargets()
  }

  // Set 用于去重，最终仍按 allTargets 的固定顺序返回，保证日志稳定。
  Set<String> affected = [] as Set<String>
  Map<String, List<String>> dependents = packageDependents()

  files.each { file ->
    String target = targetForFile(file)
    if (target && allTargets().contains(target)) {
      affected.add(target)
      (dependents[target] ?: []).each { affected.add(it) }
    }
  }

  return allTargets().findAll { affected.contains(it) }
}

def detectAffectedTargets(String baseRef = defaultBaseRef(), String headRef = 'HEAD') {
  List<String> files = changedFiles(baseRef, headRef)
  List<String> targets = resolveAffectedTargets(files)

  echo files ? "Changed files:\n${files.join('\n')}" : 'No changed files detected.'
  echo targets ? "Affected targets: ${targets.join(', ')}" : 'No workspace target is affected.'
  return targets
}

def runPackageScript(String target, String scriptName) {
  if (!allTargets().contains(target)) {
    error "Unknown workspace target: ${target}"
  }
  if (!(scriptName ==~ /[0-9A-Za-z:_-]+/)) {
    error "Invalid package script name: ${scriptName}"
  }

  // 不同 workspace 的 scripts 不完全相同，--if-present 可安全跳过未定义脚本。
  runCommand("pnpm --filter \"./${target}\" run --if-present ${scriptName}")
}

// 每个目标生成一个 Jenkins 并行分支，缩短质量检查和构建耗时。
def runParallel(List<String> targets, String stagePrefix, Closure action) {
  if (!targets) {
    echo "Skipping ${stagePrefix}: no affected targets."
    return
  }

  Map<String, Closure> branches = [:]
  targets.each { target ->
    String currentTarget = target
    String displayName = currentTarget.tokenize('/').last()
    branches[displayName] = {
      stage("${stagePrefix}: ${displayName}") {
        action.call(currentTarget)
      }
    }
  }
  parallel branches
}

def checkTargets(List<String> targets) {
  runParallel(targets, 'Check') { target ->
    runPackageScript(target, 'lint')
    runPackageScript(target, 'typecheck')
    runPackageScript(target, 'test')
  }
}

def buildTargets(List<String> targets) {
  List<String> packages = workspacePackages().findAll { targets.contains(it) }
  List<String> apps = workspaceApps().findAll { targets.contains(it) }

  // 公共包必须先完成构建，之后才能并行构建依赖这些包的业务应用。
  runParallel(packages, 'Build package') { target ->
    runPackageScript(target, 'build')
  }
  runParallel(apps, 'Build app') { target ->
    runPackageScript(target, 'build')
  }
}

// 仅归档本次实际构建的 app，fingerprint 用于追踪不同构建间的产物。
def archiveAppArtifacts(List<String> targets) {
  List<String> appArtifacts = workspaceApps()
    .findAll { targets.contains(it) }
    .collect { "${it}/dist/**" }

  if (!appArtifacts) {
    echo 'Skipping artifact archive: no application was built.'
    return
  }
  archiveArtifacts artifacts: appArtifacts.join(','), fingerprint: true
}

// Jenkins load 返回当前脚本对象，Jenkinsfile 才能调用上面的公共方法。
return this
