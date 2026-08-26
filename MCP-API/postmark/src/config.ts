import { z } from 'zod';

const envSchema = z.object({
  POSTMARK_SERVER_TOKEN: z.string().min(1),
  POSTMARK_DEFAULT_SENDER_EMAIL: z.string().email(),
  POSTMARK_DEFAULT_MESSAGE_STREAM: z.string().min(1).default('outbound'),
  POSTMARK_APPROVAL_SECRET: z.string().min(16),
  POSTMARK_WEBHOOK_URL_ALLOWLIST: z.string().optional(),
  POSTMARK_RECIPIENT_DOMAIN_ALLOWLIST: z.string().optional(),
  POSTMARK_UPSTREAM_TIMEOUT_MS: z.coerce.number().int().min(1000).max(120000).default(30000)
});

export type Config = {
  serverToken: string;
  defaultSenderEmail: string;
  defaultMessageStream: string;
  approvalSecret: string;
  webhookUrlAllowlist: string[];
  recipientDomainAllowlist: string[];
  timeoutMs: number;
};

function csv(value?: string): string[] {
  return value?.split(',').map(v => v.trim().toLowerCase()).filter(Boolean) ?? [];
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const parsed = envSchema.safeParse(env);
  if (!parsed.success) {
    throw new Error(`Invalid Postmark connector configuration: ${parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ')}`);
  }
  return {
    serverToken: parsed.data.POSTMARK_SERVER_TOKEN,
    defaultSenderEmail: parsed.data.POSTMARK_DEFAULT_SENDER_EMAIL,
    defaultMessageStream: parsed.data.POSTMARK_DEFAULT_MESSAGE_STREAM,
    approvalSecret: parsed.data.POSTMARK_APPROVAL_SECRET,
    webhookUrlAllowlist: csv(parsed.data.POSTMARK_WEBHOOK_URL_ALLOWLIST),
    recipientDomainAllowlist: csv(parsed.data.POSTMARK_RECIPIENT_DOMAIN_ALLOWLIST),
    timeoutMs: parsed.data.POSTMARK_UPSTREAM_TIMEOUT_MS
  };
}
