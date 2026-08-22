import { createHmac, timingSafeEqual } from 'node:crypto';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export function assertFromAllowed(from: string, allowed: Set<string>): void {
  if (allowed.size === 0) throw new Error('No TWILIO_ALLOWED_FROM_NUMBERS configured; outbound actions are disabled');
  if (!allowed.has(from)) throw new Error(`Outbound sender ${from} is not allowed`);
}

export function approvalSignature(tool: string, target: string, timestamp: number, secret: string): string {
  return createHmac('sha256', secret).update(`${tool}|${target}|${timestamp}`).digest('hex');
}

export function assertApproval(tool: string, target: string, token: string | undefined, secret: string, now = Date.now()): void {
  if (!token) throw new Error(`Approval required for ${tool}`);
  const [rawTs, signature] = token.split(':');
  const timestamp = Number(rawTs);
  if (!Number.isInteger(timestamp) || !signature || !/^[0-9a-f]{64}$/i.test(signature)) throw new Error('Invalid approval token format');
  if (Math.abs(now - timestamp) > 5 * 60_000) throw new Error('Approval token expired');
  const expected = approvalSignature(tool, target, timestamp, secret);
  const a = Buffer.from(signature, 'hex');
  const b = Buffer.from(expected, 'hex');
  if (a.length !== b.length || !timingSafeEqual(a, b)) throw new Error('Approval token does not match this action');
}
