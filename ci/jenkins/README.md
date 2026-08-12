# Jenkins CI/CD

该目录包含 pnpm monorepo 的公共、构建和部署脚本：

- `monorepo.groovy`：环境检查、变更分析、质量检查、构建和归档等公共能力。
- `build.groovy`：构建流程编排，并通过 Jenkins stash 保存每个 app 的 `dist`。
- `deploy.groovy`：上传静态产物、原子切换版本、健康检查、失败回滚和历史清理。

## Jenkinsfile 示例

```groovy
pipeline {
  agent { label 'node-linux' }

  parameters {
    choice(name: 'DEPLOY_ENV', choices: ['dev', 'test', 'prod'], description: '部署环境')
    booleanParam(name: 'DEPLOY_ENABLED', defaultValue: false, description: '是否部署')
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build monorepo') {
      steps {
        script {
          def monorepo = load 'ci/jenkins/monorepo.groovy'
          def builder = load 'ci/jenkins/build.groovy'
          env.BUILT_APPS = builder.execute(
            monorepo: monorepo,
            // 同域部署可省略 buildEnvironment；不同域名时在这里覆盖 remote entry。
            buildEnvironment: [:],
          ).apps.join(',')
        }
      }
    }

    stage('Deploy') {
      when {
        expression { params.DEPLOY_ENABLED && env.BUILT_APPS?.trim() }
      }
      steps {
        script {
          def deployer = load 'ci/jenkins/deploy.groovy'
          deployer.execute(
            apps: env.BUILT_APPS.tokenize(','),
            environment: params.DEPLOY_ENV,
            host: 'frontend.example.internal',
            port: 22,
            remoteRoot: '/srv/central-platform',
            credentialsId: 'central-platform-deploy-key',
            keepReleases: 5,
            healthChecks: [
              'shell-app': 'https://platform.example.com/',
              'product-center': 'https://platform.example.com/product-center/remoteProductCenter.js',
              'protocol-center': 'https://platform.example.com/protocol-center/remoteProtocolCenter.js',
              'payment-center': 'https://platform.example.com/payment-center/remotePaymentCenter.js',
              'user-center': 'https://platform.example.com/user-center/remoteUserCenter.js',
            ],
          )
        }
      }
    }
  }
}
```

## 服务器约定

生产环境使用单域名和单个 443 端口，`/product-center/` 等路径只承载 remote 静态资源，`/product`、`/protocol`、`/payment/*`、`/user/*` 仍由 shell 的前端路由处理。完整配置见 `ci/nginx/central-platform.conf`。

Nginx 的静态目录指向各应用的 `current` 软链，例如：

```nginx
location ^~ /product-center/ {
  alias /srv/central-platform/prod/product-center/current/;
}
```

Jenkins Linux Agent 需要提供 `node`、`pnpm`、`ssh`、`scp`、`tar`、`curl`，并提前将部署服务器写入 `known_hosts`。SSH 凭据类型使用 `SSH Username with private key`。

`shell-app` 在 production 模式下默认使用同源 remote 路径，并通过 `apps/shell-app/.env.production` 统一维护；Jenkins 也可以使用 `buildEnvironment` 临时覆盖这些变量。开发模式仍默认连接本地 `4001` 到 `4004` 端口。
