export function formatTargetDir(targetDir?: string) {
  return targetDir?.trim().replace(/[\\/]+$/g, "");
}
