import { z } from 'zod';

const EnvSchema = z.object({
  TRELLO_API_KEY: z.string().min(1),
  TRELLO_TOKEN: z.string().min(1),
  TRELLO_API_BASE_URL: z.string().url().default('https://api.trello.com/1'),
  TRELLO_TIMEOUT_MS: z.coerce.number().int().min(1000).max(60000).default(15000),
  TRELLO_APPROVAL_MODE: z.enum(['required', 'disabled']).default('required'),
  TRELLO_APPROVED_ACTIONS: z.string().default(''),
  TRELLO_ALLOW_ARCHIVE: z.enum(['true', 'false']).default('false')
});

export type Config = ReturnType<typeof loadConfig>;

export function loadConfig(env: NodeJS.ProcessEnv = process.env) {
  const parsed = EnvSchema.parse(env);
  return {
    apiKey: parsed.TRELLO_API_KEY,
    token: parsed.TRELLO_TOKEN,
    baseUrl: parsed.TRELLO_API_BASE_URL.replace(/\/$/, ''),
    timeoutMs: parsed.TRELLO_TIMEOUT_MS,
    approvalMode: parsed.TRELLO_APPROVAL_MODE,
    approvedActions: new Set(parsed.TRELLO_APPROVED_ACTIONS.split(',').map(x => x.trim()).filter(Boolean)),
    allowArchive: parsed.TRELLO_ALLOW_ARCHIVE === 'true'
  };
}

export function assertWriteAllowed(config: Config, action: string, archive = false) {
  if (config.approvalMode === 'required' && !config.approvedActions.has(action)) {
    throw new Error(`APPROVAL_REQUIRED: operator must add ${action} to TRELLO_APPROVED_ACTIONS`);
  }
  if (archive && !config.allowArchive) {
    throw new Error('ARCHIVE_DISABLED: set TRELLO_ALLOW_ARCHIVE=true after explicit human approval');
  }
}
