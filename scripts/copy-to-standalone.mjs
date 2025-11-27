import { cp, mkdir } from "node:fs/promises";
import path from "node:path";

const copies = [
  { src: ".next/static", dest: ".next/standalone/.next/static" },
  { src: "public", dest: ".next/standalone/public" },
];

async function ensureDir(dirPath) {
  await mkdir(dirPath, { recursive: true });
}

async function copyAssets() {
  for (const { src, dest } of copies) {
    const parentDir = path.dirname(dest);
    await ensureDir(parentDir);
    await cp(src, dest, { recursive: true, force: true });
  }
}

copyAssets().catch((error) => {
  console.error("Failed to copy build assets:", error);
  process.exit(1);
});
