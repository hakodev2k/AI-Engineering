import { z } from 'zod';

const EnvSchema = z.object({
  MAILCHIMP_API_KEY: z.string().min(1).optional(),
  MAILCHIMP_OAUTH_ACCESS_TOKEN: z.string().min(1).optional(),
  MAILCHIMP_SERVER_PREFIX: z.string().regex(/^us\d+$/),
  MAILCHIMP_APPROVAL_SECRET: z.string().min(24).optional(),
  MAILCHIMP_TIMEOUT_MS: z.coerce.number().int().min(1000).max(120000).default(20000),
  MAILCHIMP_MAX_RETRIES: z.coerce.number().int().min(0).max(5).default(2)
}).superRefine((value, ctx) => {
  if (!value.MAILCHIMP_API_KEY && !value.MAILCHIMP_OAUTH_ACCESS_TOKEN) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Set MAILCHIMP_API_KEY or MAILCHIMP_OAUTH_ACCESS_TOKEN' });
  }
  if (value.MAILCHIMP_API_KEY && value.MAILCHIMP_OAUTH_ACCESS_TOKEN) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Set only one Mailchimp credential type' });
  }
});

export type Config = {
  baseUrl: string;
  apiKey?: string;
  oauthToken?: string;
  approvalSecret?: string;
  timeoutMs: number;
  maxRetries: number;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const parsed = EnvSchema.parse(env);
  return {
    baseUrl: `https://${parsed.MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0`,
    apiKey: parsed.MAILCHIMP_API_KEY,
    oauthToken: parsed.MAILCHIMP_OAUTH_ACCESS_TOKEN,
    approvalSecret: parsed.MAILCHIMP_APPROVAL_SECRET,
    timeoutMs: parsed.MAILCHIMP_TIMEOUT_MS,
    maxRetries: parsed.MAILCHIMP_MAX_RETRIES
  };
}
