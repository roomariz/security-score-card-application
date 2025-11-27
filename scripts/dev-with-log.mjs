import { createWriteStream } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";

const logStream = createWriteStream("dev.log", { flags: "a" });
const pathKey =
  Object.keys(process.env).find((key) => key.toLowerCase() === "path") ??
  "PATH";
const binPath = path.join(process.cwd(), "node_modules", ".bin");
const delim = process.platform === "win32" ? ";" : ":";
const env = { ...process.env };
env[pathKey] = env[pathKey]
  ? `${binPath}${delim}${env[pathKey]}`
  : binPath;
env.NODE_ENV = "development"; // Next dev assumes standard NODE_ENV
env.BABEL_ENV = env.BABEL_ENV ?? "development";

const nextCliPath = path.join(
  process.cwd(),
  "node_modules",
  "next",
  "dist",
  "bin",
  "next",
);
const nextDev = spawn(process.execPath, [nextCliPath, "dev", "-p", "3000"], {
  env,
  stdio: ["inherit", "pipe", "pipe"],
});

if (nextDev.stdout) {
  nextDev.stdout.pipe(process.stdout);
  nextDev.stdout.pipe(logStream, { end: false });
}

if (nextDev.stderr) {
  nextDev.stderr.pipe(process.stderr);
  nextDev.stderr.pipe(logStream, { end: false });
}

const shutdown = (code = 0) => {
  logStream.end(() => process.exit(code));
};

const handleSignal = (signal) => {
  nextDev.kill(signal);
};

nextDev.on("exit", (code) => shutdown(code ?? 0));
["SIGINT", "SIGTERM", "SIGHUP"].forEach((signal) => process.on(signal, () => handleSignal(signal)));
