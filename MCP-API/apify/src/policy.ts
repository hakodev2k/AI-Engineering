import { config } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

const phrases: Record<string, string> = {
  'apify.actor.run': 'APPROVE_PAID_EXECUTION',
  'apify.task.run': 'APPROVE_PAID_EXECUTION',
  'apify.run.abort': 'APPROVE_ABORT',
  'apify.webhook.create': 'APPROVE_EXTERNAL_WEBHOOK',
  'apify.webhook.delete': 'APPROVE_DELETE',
};

export function requirePermission(tool: string, risk: Risk, approval?: string): void {
  if (risk === 'READ') return;
  if (!config.allowWrite) throw new Error('WRITE operations are disabled by APIFY_ALLOW_WRITE');
  if ((risk === 'HIGH_RISK' || risk === 'DESTRUCTIVE') && !config.allowHighRisk) {
    throw new Error('HIGH_RISK operations are disabled by APIFY_ALLOW_HIGH_RISK');
  }
  if (risk === 'DESTRUCTIVE' && !config.allowDestructive) {
    throw new Error('DESTRUCTIVE operations are disabled by APIFY_ALLOW_DESTRUCTIVE');
  }
  const required = phrases[tool];
  if (required && approval !== required) throw new Error(`Explicit human approval required: ${required}`);
}

export function validateWebhookUrl(value: string): URL {
  const url = new URL(value);
  if (url.protocol !== 'https:') throw new Error('Webhook target must use HTTPS');
  const host = url.hostname.toLowerCase();
  if (host === 'localhost' || host.endsWith('.localhost') || host === '::1') throw new Error('Private/local webhook targets are blocked');
  const ipv4 = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4) {
    const [a,b] = [Number(ipv4[1]), Number(ipv4[2])];
    if (a === 10 || a === 127 || a === 0 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168)) {
      throw new Error('Private/local webhook targets are blocked');
    }
  }
  return url;
}
