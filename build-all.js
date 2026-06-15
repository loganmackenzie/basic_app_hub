import { execSync } from "child_process";
import fs from "fs";
import path from "path";

// 1. Build the main dashboard index first
console.log("Building root dashboard...");
execSync("npx vite build", {
  env: { ...process.env, PROJECT_TARGET: "root" },
  stdio: "inherit",
});

// 2. Scan the src/ folder to find your sub-projects
const srcPath = path.resolve("src");
const projects = fs.readdirSync(srcPath).filter((file) => {
  return fs.statSync(path.join(srcPath, file)).isDirectory();
});

// 3. Build each sub-project one by one as an isolated single file
for (const project of projects) {
  console.log(`Building isolated single-file project: ${project}...`);
  execSync("npx vite build", {
    env: { ...process.env, PROJECT_TARGET: project },
    stdio: "inherit",
  });
}

console.log(
  "🎉 All projects successfully compiled into independent single HTML files!",
);
