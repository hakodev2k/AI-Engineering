import { z } from 'zod';

const schema = z.object({
  STRIPE_API_KEY: z.string().min(10),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_API_VERSION: z.string().optional(),
  STRIPE_LIVE_MODE_ALLOWED: z.enum(['true', 'false']).default('false'),
  STRIPE_APPROVAL_SECRET: z.string().min(16).optional()
});

export type StripeConfig = {
  apiKey: string;
  webhookSecret?: string;
  apiVersion?: string;
  liveModeAllowed: boolean;
  approvalSecret?: string;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): StripeConfig {
  const v = schema.parse(env);
  const liveKey = v.STRIPE_API_KEY.startsWith('sk_live_') || v.STRIPE_API_KEY.startsWith('rk_live_');
  if (liveKey && v.STRIPE_LIVE_MODE_ALLOWED !== 'true') {
    throw new Error('Live-mode Stripe key rejected. Set STRIPE_LIVE_MODE_ALLOWED=true explicitly.');
  }
  return {
    apiKey: v.STRIPE_API_KEY,
    webhookSecret: v.STRIPE_WEBHOOK_SECRET,
    apiVersion: v.STRIPE_API_VERSION,
    liveModeAllowed: v.STRIPE_LIVE_MODE_ALLOWED === 'true',
    approvalSecret: v.STRIPE_APPROVAL_SECRET
  };
}
