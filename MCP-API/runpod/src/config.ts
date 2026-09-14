export type RunpodConfig = {
  apiKey: string;
  approvalSecret: string;
  timeoutMs: number;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): RunpodConfig {
  const apiKey = env.RUNPOD_API_KEY?.trim();
  if (!apiKey) throw new Error('RUNPOD_API_KEY is required');

  const approvalSecret = env.RUNPOD_APPROVAL_SECRET?.trim();
  if (!approvalSecret) throw new Error('RUNPOD_APPROVAL_SECRET is required');

  const timeoutMs = Number(env.RUNPOD_UPSTREAM_TIMEOUT_MS ?? '20000');
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) {
    throw new Error('RUNPOD_UPSTREAM_TIMEOUT_MS must be an integer between 1000 and 120000');
  }

  return { apiKey, approvalSecret, timeoutMs };
}
