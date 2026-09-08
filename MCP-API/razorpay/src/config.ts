export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export interface Config {
  keyId: string;
  keySecret: string;
  merchantToken: string;
  timeoutMs: number;
  requireWriteApproval: boolean;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const keyId = env.RAZORPAY_KEY_ID?.trim();
  const keySecret = env.RAZORPAY_KEY_SECRET?.trim();
  if (!keyId || !keySecret) throw new Error('RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are required');
  const timeoutMs = Number(env.RAZORPAY_TIMEOUT_MS ?? '15000');
  if (!Number.isFinite(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) throw new Error('RAZORPAY_TIMEOUT_MS must be 1000..120000');
  const merchantToken = env.RAZORPAY_MERCHANT_TOKEN?.trim() || Buffer.from(`${keyId}:${keySecret}`).toString('base64');
  return { keyId, keySecret, merchantToken, timeoutMs, requireWriteApproval: (env.RAZORPAY_REQUIRE_WRITE_APPROVAL ?? 'true').toLowerCase() !== 'false' };
}

export const TOOL_RISK: Record<string, Risk> = {
  'razorpay.payment.get': 'READ', 'razorpay.payment.list': 'READ', 'razorpay.payment.card.get': 'READ',
  'razorpay.payment.capture': 'HIGH_RISK',
  'razorpay.order.get': 'READ', 'razorpay.order.list': 'READ', 'razorpay.order.payments.list': 'READ', 'razorpay.order.create': 'WRITE',
  'razorpay.payment_link.get': 'READ', 'razorpay.payment_link.list': 'READ', 'razorpay.payment_link.create': 'HIGH_RISK',
  'razorpay.refund.get': 'READ', 'razorpay.refund.list': 'READ', 'razorpay.refund.create': 'HIGH_RISK',
  'razorpay.settlement.get': 'READ', 'razorpay.settlement.list': 'READ', 'razorpay.settlement.recon': 'READ'
};

export function enforce(tool: string, approved: boolean | undefined, requireWriteApproval: boolean): void {
  const risk = TOOL_RISK[tool];
  if (!risk) throw new Error(`Unknown tool policy: ${tool}`);
  if (risk === 'DESTRUCTIVE') throw new Error(`${tool} is disabled by policy`);
  if ((risk === 'HIGH_RISK' || (risk === 'WRITE' && requireWriteApproval)) && approved !== true) {
    throw new Error(`${tool} requires explicit human approval (approved=true)`);
  }
}
