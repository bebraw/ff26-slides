import { access, copyFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const targetPath = resolve(".generated/break-slides.json");
const fallbackPath = resolve("src/break-slides.json");

try {
  await access(targetPath);
  console.log(`Using existing ${targetPath}`);
} catch (error) {
  if (!(error instanceof Error) || !("code" in error) || error.code !== "ENOENT") {
    throw error;
  }

  await mkdir(resolve(".generated"), { recursive: true });
  await copyFile(fallbackPath, targetPath);
  console.log(`Wrote fallback ${targetPath}`);
}
