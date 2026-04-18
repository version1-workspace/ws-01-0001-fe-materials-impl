import { execSync, spawn, type ChildProcess } from "child_process";

const PORT = 3099;
let server: ChildProcess;

export async function setup() {
  await waitForPortFree(PORT);

  execSync("npx next build", {
    cwd: process.cwd(),
    stdio: "inherit",
    env: { ...process.env, NODE_ENV: "production" },
  });

  server = spawn("npx", ["next", "start", "--port", String(PORT)], {
    cwd: process.cwd(),
    stdio: "pipe",
    env: { ...process.env, NODE_ENV: "production" },
  });

  await waitForReady(PORT, 30000);
}

export async function teardown() {
  if (server) {
    server.kill("SIGTERM");
  }
}

async function waitForReady(port: number, timeout = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const res = await fetch(`http://localhost:${port}/api/v1`);
      if (res.ok) return;
    } catch {
      // not ready yet
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Server did not start within ${timeout}ms`);
}

async function waitForPortFree(port: number) {
  try {
    await fetch(`http://localhost:${port}`);
    throw new Error(`Port ${port} is already in use`);
  } catch (e) {
    if (e instanceof Error && e.message.includes("already in use")) throw e;
  }
}
