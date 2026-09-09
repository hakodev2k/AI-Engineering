export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK';

export type PolicyConfig = {
  requireWriteApproval: boolean;
  allowWebhookWrites: boolean;
};

export function authorize(risk: Risk, approved: boolean | undefined, cfg: PolicyConfig): void {
  if (risk === 'READ') return;
  if (risk === 'HIGH_RISK' && !cfg.allowWebhookWrites) {
    throw new Error('High-risk webhook writes are disabled. Set SONARQUBE_ALLOW_WEBHOOK_WRITES=true only after policy review.');
  }
  if ((risk === 'HIGH_RISK' || cfg.requireWriteApproval) && approved !== true) {
    throw new Error(`Human approval is required for ${risk} operation`);
  }
}

export function assertHttpsWebhook(url: string): void {
  const parsed = new URL(url);
  if (parsed.protocol !== 'https:') throw new Error('Webhook URL must use HTTPS');
  if (['localhost', '127.0.0.1', '::1'].includes(parsed.hostname)) {
    throw new Error('Webhook URL must not target loopback hosts');
  }
  const parts = parsed.hostname.split('.');
  if (parts.length === 4 && parts.every((p) => /^\d+$/.test(p))) {
    const [a, b] = parts.map(Number);
    if (a === 10 || a === 127 || (a === 192 && b === 168) || (a === 172 && b >= 16 && b <= 31)) {
      throw new Error('Webhook URL must not target private IPv4 ranges');
    }
  }
}
