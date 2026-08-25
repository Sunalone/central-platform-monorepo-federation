import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import type { Plugin } from "vite";

const cMapDirectory = fileURLToPath(new URL("./cmaps/", import.meta.url));

/**
 * Emits PDF.js CMaps beside application chunks while preserving their lookup names.
 * 将 PDF.js CMap 输出到应用资源目录，并保留 PDF.js 查询时使用的原始文件名。
 */
export const emitPdfCMapAssets = (): Plugin => ({
  name: "central-platform:pdf-cmaps",
  apply: "build",
  async buildStart() {
    const fileNames = (await readdir(cMapDirectory)).filter((fileName) =>
      fileName.endsWith(".bcmap")
    );

    await Promise.all(
      fileNames.map(async (fileName) => {
        this.emitFile({
          type: "asset",
          fileName: `assets/cmaps/${fileName}`,
          source: await readFile(join(cMapDirectory, fileName))
        });
      })
    );
  }
});
