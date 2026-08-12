import { cp, mkdir, rm } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = path.join(rootDir, 'vercel-dist');
const pnpmCommand = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
const pnpmCliPath = process.env.npm_execpath;

const apps = [
  { name: 'product-center', filter: '@central-platform/product-center' },
  { name: 'protocol-center', filter: '@central-platform/protocol-center' },
  { name: 'payment-center', filter: '@central-platform/payment-center' },
  { name: 'user-center', filter: '@central-platform/user-center' },
  { name: 'shell-app', filter: 'shell-app' },
];

const runBuild = ({ name, filter }) => {
  console.log(`\n[vercel] Building ${name}...`);
  const command = pnpmCliPath ? process.execPath : pnpmCommand;
  const args = pnpmCliPath
    ? [pnpmCliPath, '--filter', filter, 'build']
    : ['--filter', filter, 'build'];
  const result = spawnSync(command, args, {
    cwd: rootDir,
    env: { ...process.env, NODE_ENV: 'production' },
    stdio: 'inherit',
  });

  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`${name} build failed with exit code ${result.status}.`);
  }
};

await rm(outputDir, { recursive: true, force: true });

for (const app of apps) runBuild(app);

// The shell owns the site root; each remote keeps the same subpath used by its Vite base.
await cp(path.join(rootDir, 'apps/shell-app/dist'), outputDir, {
  recursive: true,
});

for (const app of apps.filter(({ name }) => name !== 'shell-app')) {
  const targetDir = path.join(outputDir, app.name);
  await mkdir(targetDir, { recursive: true });
  await cp(path.join(rootDir, `apps/${app.name}/dist`), targetDir, {
    recursive: true,
  });
}

console.log(`\n[vercel] Static deployment assembled at ${outputDir}.`);
