import path from 'node:path';
import { z } from 'zod';

const EnvSchema = z.object({
  ELEVENLABS_API_KEY: z.string().min(1),
  ELEVENLABS_MCP_COMMAND: z.string().min(1).default('uvx'),
  ELEVENLABS_MCP_ARGS: z.string().default('elevenlabs-mcp'),
  ELEVENLABS_MCP_BASE_PATH: z.string().default(''),
  ELEVENLABS_API_RESIDENCY: z.string().min(1).default('us'),
  ELEVENLABS_MCP_OUTPUT_MODE: z.enum(['files', 'resources', 'both']).default('files'),
  ELEVENLABS_APPROVAL_MODE: z.enum(['required', 'disabled']).default('required'),
  ELEVENLABS_APPROVED_ACTIONS: z.string().default(''),
  ELEVENLABS_ALLOWED_INPUT_ROOT: z.string().default(''),
  ELEVENLABS_TIMEOUT_MS: z.coerce.number().int().min(5000).max(300000).default(60000)
});

export type Config = ReturnType<typeof loadConfig>;

export function loadConfig(env: NodeJS.ProcessEnv = process.env) {
  const parsed = EnvSchema.parse(env);
  return {
    apiKey: parsed.ELEVENLABS_API_KEY,
    command: parsed.ELEVENLABS_MCP_COMMAND,
    args: parsed.ELEVENLABS_MCP_ARGS.split(/\s+/).filter(Boolean),
    basePath: parsed.ELEVENLABS_MCP_BASE_PATH || undefined,
    residency: parsed.ELEVENLABS_API_RESIDENCY,
    outputMode: parsed.ELEVENLABS_MCP_OUTPUT_MODE,
    approvalMode: parsed.ELEVENLABS_APPROVAL_MODE,
    approvedActions: new Set(parsed.ELEVENLABS_APPROVED_ACTIONS.split(',').map(x => x.trim()).filter(Boolean)),
    allowedInputRoot: parsed.ELEVENLABS_ALLOWED_INPUT_ROOT ? path.resolve(parsed.ELEVENLABS_ALLOWED_INPUT_ROOT) : undefined,
    timeoutMs: parsed.ELEVENLABS_TIMEOUT_MS
  };
}

export function assertApproved(config: Config, action: string) {
  if (config.approvalMode === 'required' && !config.approvedActions.has(action)) {
    throw new Error(`APPROVAL_REQUIRED: operator must add ${action} to ELEVENLABS_APPROVED_ACTIONS`);
  }
}

export function assertInputPathAllowed(config: Config, inputPath: string) {
  if (!config.allowedInputRoot) return;
  const resolved = path.resolve(inputPath);
  const relative = path.relative(config.allowedInputRoot, resolved);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error('INPUT_PATH_DENIED: file must be inside ELEVENLABS_ALLOWED_INPUT_ROOT');
  }
}
