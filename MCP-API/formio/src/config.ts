export interface Config {
  allowWrites: boolean;
  allowHighRisk: boolean;
  allowDestructive: boolean;
  command: string;
  args: string[];
  env: NodeJS.ProcessEnv;
}

const bool = (name: string) => process.env[name]?.toLowerCase() === "true";

export function loadConfig(): Config {
  const command = process.env.FORMIO_UPSTREAM_COMMAND || "npx";
  const args = (process.env.FORMIO_UPSTREAM_ARGS || "-y,@formio/mcp@0.13.0").split(",").filter(Boolean);
  const env: NodeJS.ProcessEnv = { ...process.env };
  return {
    allowWrites: bool("FORMIO_ALLOW_WRITES"),
    allowHighRisk: bool("FORMIO_ALLOW_HIGH_RISK"),
    allowDestructive: bool("FORMIO_ALLOW_DESTRUCTIVE"),
    command,
    args,
    env
  };
}
