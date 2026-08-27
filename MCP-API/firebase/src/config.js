import path from "node:path";

function boolEnv(name, fallback = false) {
  const raw = process.env[name];
  if (raw === undefined || raw === "") return fallback;
  if (raw === "true") return true;
  if (raw === "false") return false;
  throw new Error(`${name} must be true or false`);
}

function intEnv(name, fallback, min, max) {
  const raw = process.env[name];
  if (raw === undefined || raw === "") return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new Error(`${name} must be an integer between ${min} and ${max}`);
  }
  return value;
}

export function loadConfig() {
  const projectDir = path.resolve(process.env.FIREBASE_PROJECT_DIR || ".");
  const command = process.env.FIREBASE_UPSTREAM_COMMAND || "npx";
  const args = (process.env.FIREBASE_UPSTREAM_ARGS || "-y,firebase-tools@latest,mcp")
    .split(",").map((x) => x.trim()).filter(Boolean);

  if (!command || !args.length) throw new Error("Firebase upstream command and args are required");

  return Object.freeze({
    projectDir,
    command,
    args,
    timeoutMs: intEnv("FIREBASE_TIMEOUT_MS", 20000, 1000, 120000),
    approvalSecret: process.env.FIREBASE_APPROVAL_SECRET || "",
    destructiveEnabled: boolEnv("FIREBASE_ENABLE_DESTRUCTIVE", false)
  });
}
