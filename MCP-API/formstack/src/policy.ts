export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export function authorize(
  risk: Risk,
  approved: boolean | undefined,
  cfg: { requireWriteApproval: boolean; destructiveEnabled: boolean }
): void {
  if (risk === 'READ') return;
  if (risk === 'DESTRUCTIVE' && !cfg.destructiveEnabled) {
    throw new Error('Destructive Formstack tools are disabled. Set FORMSTACK_DESTRUCTIVE_ENABLED=true only after policy review.');
  }
  const mustApprove = risk === 'HIGH_RISK' || risk === 'DESTRUCTIVE' || cfg.requireWriteApproval;
  if (mustApprove && approved !== true) {
    throw new Error(`${risk} operation requires explicit human approval (approved=true).`);
  }
}

export function assertSafeWebhookUrl(value: string): void {
  const url = new URL(value);
  if (url.protocol !== 'https:') throw new Error('Webhook URL must use HTTPS');
  const host = url.hostname.toLowerCase();
  if (host === 'localhost' || host === '127.0.0.1' || host === '::1' || host.endsWith('.local')) {
    throw new Error('Webhook URL may not target a local host');
  }
  if (/^10\./.test(host) || /^192\.168\./.test(host) || /^169\.254\./.test(host) || /^172\.(1[6-9]|2\d|3[01])\./.test(host)) {
    throw new Error('Webhook URL may not target a private IPv4 address');
  }
}
