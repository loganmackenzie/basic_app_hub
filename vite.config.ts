import { defineConfig } from "vite";
import { resolve } from "path";
import { viteSingleFile } from "vite-plugin-singlefile";

// Read which project we want to build right now
const targetProject = process.env.PROJECT_TARGET || "root";

console.log(`Building project: ${targetProject} -- ${__dirname}`);

let rootDir = __dirname;
let outDirConfig = resolve(__dirname, "dist");

console.log(`Input Config: ${rootDir}, OutDir Config: ${outDirConfig}`);

if (targetProject !== "root") {
  rootDir = resolve(__dirname, `src/${targetProject}`);
  outDirConfig = resolve(__dirname, `dist/${targetProject}`);
}

console.log(
  `Updated Input Config: ${rootDir}, Updated OutDir Config: ${outDirConfig}`,
);
export default defineConfig({
  root: rootDir,
  plugins: [viteSingleFile()],
  build: {
    outDir: outDirConfig,
    minify: true,
    cssMinify: true,
    emptyOutDir: targetProject === "root", // Clear dist folder ONLY on the first root build
  },
});
