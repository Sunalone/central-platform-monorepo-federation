import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src"],
  format: ["cjs"],
  // --dts 生成类型声明
  dts: true,
  // --clean 打包前清空dist
  clean: true,
  target: "node20",
  minify: true
});
