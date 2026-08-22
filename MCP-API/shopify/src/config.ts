import { z } from 'zod';

const EnvSchema = z.object({
  SHOPIFY_SHOP_DOMAIN: z.string().min(1).regex(/^[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com$/),
  SHOPIFY_ADMIN_ACCESS_TOKEN: z.string().min(1),
  SHOPIFY_API_VERSION: z.string().regex(/^20\d{2}-(01|04|07|10)$/).default('2026-07'),
  SHOPIFY_TIMEOUT_MS: z.coerce.number().int().min(1000).max(60000).default(15000),
  SHOPIFY_APPROVAL_MODE: z.enum(['required', 'disabled']).default('required'),
  SHOPIFY_APPROVED_ACTIONS: z.string().default(''),
  SHOPIFY_ALLOW_DESTRUCTIVE: z.enum(['true', 'false']).default('false')
});

export type Config = ReturnType<typeof loadConfig>;

export function loadConfig(env: NodeJS.ProcessEnv = process.env) {
  const parsed = EnvSchema.parse(env);
  return {
    shopDomain: parsed.SHOPIFY_SHOP_DOMAIN.toLowerCase(),
    accessToken: parsed.SHOPIFY_ADMIN_ACCESS_TOKEN,
    apiVersion: parsed.SHOPIFY_API_VERSION,
    timeoutMs: parsed.SHOPIFY_TIMEOUT_MS,
    approvalMode: parsed.SHOPIFY_APPROVAL_MODE,
    approvedActions: new Set(parsed.SHOPIFY_APPROVED_ACTIONS.split(',').map(v => v.trim()).filter(Boolean)),
    allowDestructive: parsed.SHOPIFY_ALLOW_DESTRUCTIVE === 'true'
  };
}

export function assertWriteAllowed(config: Config, action: string, destructive = false) {
  if (config.approvalMode === 'required' && !config.approvedActions.has(action)) {
    throw new Error(`APPROVAL_REQUIRED: operator must add ${action} to SHOPIFY_APPROVED_ACTIONS`);
  }
  if (destructive && !config.allowDestructive) {
    throw new Error('DESTRUCTIVE_DISABLED: set SHOPIFY_ALLOW_DESTRUCTIVE=true only after explicit human approval');
  }
}
