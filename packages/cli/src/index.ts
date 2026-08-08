#!/usr/bin/env node
import chalk from "chalk";
import { Command } from "commander";
import fs from "fs-extra";
import inquirer from "inquirer";
import ora from "ora";
import path from "node:path";
import { formatTargetDir } from "./utils";

interface Answers {
  template: string;
}

const program = new Command();
const __dirname = path.dirname(process.argv[1]);
const templateRoot = path.resolve(__dirname, "../templates");

program
  .name("create-cli")
  .description("Create a central platform app from local templates")
  .argument("[project-name]", "project directory")
  .option("-t, --template <template>", "template name from packages/cli/templates")
  .action(async (projectName?: string, options?: { template?: string }) => {
    await createProject(formatTargetDir(projectName), options?.template);
  });

program.parse();

async function createProject(projectName?: string, selectedTemplate?: string) {
  if (!projectName) {
    console.log(chalk.red("The project name cannot be empty."));
    process.exitCode = 1;
    return;
  }

  const projectPath = path.resolve(process.cwd(), projectName);
  if (await fs.pathExists(projectPath)) {
    console.log(chalk.yellow("A project with the same name already exists."));
    process.exitCode = 1;
    return;
  }

  const templates = await listTemplates();
  if (templates.length === 0) {
    console.log(chalk.red(`No local templates found in ${templateRoot}.`));
    process.exitCode = 1;
    return;
  }

  const template = selectedTemplate ?? (await promptTemplate(templates)).template;
  if (!templates.includes(template)) {
    console.log(
      chalk.red(`Template "${template}" does not exist. Available: ${templates.join(", ")}`)
    );
    process.exitCode = 1;
    return;
  }

  const spinner = ora(`Creating ${projectName} from ${template}`).start();
  try {
    await copyTemplate(template, projectPath, projectName);
    spinner.succeed("Project created");
    console.log(chalk.blue("Next steps:"));
    console.log(chalk.green(`cd ${projectName}`));
    console.log(chalk.green("pnpm install"));
    console.log(chalk.green("pnpm dev"));
  } catch (error) {
    spinner.fail("Create failed");
    console.log(chalk.red(error instanceof Error ? error.message : String(error)));
    process.exitCode = 1;
  }
}

async function listTemplates() {
  const entries = await fs.readdir(templateRoot, { withFileTypes: true }).catch(() => []);
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
}

async function promptTemplate(templates: string[]) {
  return inquirer.prompt<Answers>([
    {
      name: "template",
      type: "list",
      message: "Select your local template",
      choices: templates
    }
  ]);
}

async function copyTemplate(template: string, targetPath: string, projectName: string) {
  const sourcePath = path.join(templateRoot, template);
  await fs.copy(sourcePath, targetPath);
  await renameGitignore(targetPath);
  await replaceProjectName(targetPath, projectName);
}

async function renameGitignore(targetPath: string) {
  const source = path.join(targetPath, "_gitignore");
  const target = path.join(targetPath, ".gitignore");
  if (await fs.pathExists(source)) {
    await fs.move(source, target, { overwrite: true });
  }
}

async function replaceProjectName(targetPath: string, projectName: string) {
  const entries = await fs.readdir(targetPath, { withFileTypes: true });
  await Promise.all(
    entries.map(async (entry) => {
      const currentPath = path.join(targetPath, entry.name);
      if (entry.isDirectory()) {
        await replaceProjectName(currentPath, projectName);
        return;
      }

      if (!entry.isFile() || !isTextFile(entry.name)) {
        return;
      }

      const content = await fs.readFile(currentPath, "utf8");
      await fs.writeFile(currentPath, content.replaceAll("__PROJECT_NAME__", projectName));
    })
  );
}

function isTextFile(fileName: string) {
  return [".json", ".md", ".html", ".ts", ".tsx", ".js", ".jsx", ".css"].includes(
    path.extname(fileName)
  );
}
