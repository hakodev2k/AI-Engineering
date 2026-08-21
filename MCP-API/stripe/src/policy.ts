import { createHmac, timingSafeEqual } from 'node:crypto';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export const TOOL_RISK: Record<string, Risk> = {
  'stripe.account.get': 'READ',
  'stripe.customer.list': 'READ',
  'stripe.customer.get': 'READ',
  'stripe.customer.create': 'WRITE',
  'stripe.payment_intent.list': 'READ',
  'stripe.payment_intent.get': 'READ',
  'stripe.refund.create': 'HIGH_RISK',
  'stripe.product.list': 'READ',
  'stripe.price.list': 'READ',
  'stripe.subscription.list': 'READ',
  'stripe.subscription.get': 'READ',
  'stripe.webhook.verify': 'READ'
};

export function assertApproval(tool: string, approvalId: string | undefined, secret: string | undefined): void {
  const risk = TOOL_RISK[tool] ?? 'DESTRUCTIVE';
  if (risk === 'READ') return;
  if (!secret || !approvalId) throw new Error(`${tool} requires explicit approval`);
  const expected = createHmac('sha256', secret).update(tool).digest('hex');
  const a = Buffer.from(approvalId);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) throw new Error(`Invalid approval for ${tool}`);
}
