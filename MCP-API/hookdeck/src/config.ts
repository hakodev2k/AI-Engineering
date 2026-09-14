export interface HookdeckConfig {
  apiKey: string;
  command: string;
  timeoutMs: number;
  enableWrites: boolean;
  approvalSecret?: string;
}

function integer(name: string, value: string | undefined, fallback: number, min: number, max: number): number {
  if (!value) return fallback;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < min || parsed > max) {
    throw new Error(`${name} must be an integer between ${min} and ${max}`);
  }
  return parsed;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): HookdeckConfig {
  const apiKey = env.HOOKDECK_API_KEY?.trim();
  if (!apiKey) throw new Error('HOOKDECK_API_KEY is required');
  const command = env.HOOKDECK_CLI_COMMAND?.trim() || 'hookdeck';
  if (command.includes('\0') || command.length > 512) throw new Error('HOOKDECK_CLI_COMMAND is invalid');
  return {
    apiKey,
    command,
    timeoutMs: integer('HOOKDECK_MCP_TIMEOUT_MS', env.HOOKDECK_MCP_TIMEOUT_MS, 20_000, 1_000, 120_000),
    enableWrites: env.HOOKDECK_ENABLE_WRITES === 'true',
    approvalSecret: env.HOOKDECK_APPROVAL_SECRET?.trim() || undefined
  };
}
