export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

const flag = (name: string) => process.env[name]?.toLowerCase() === 'true';

export function assertAllowed(risk: Risk): void {
  if (risk === 'READ') return;
  if (risk === 'WRITE' && flag('BREVO_ALLOW_WRITE')) return;
  if (risk === 'HIGH_RISK' && flag('BREVO_ALLOW_HIGH_RISK')) return;
  if (risk === 'DESTRUCTIVE' && flag('BREVO_ALLOW_DESTRUCTIVE')) return;
  throw new Error(`${risk} operation requires host-side approval. Enable the matching BREVO_ALLOW_* setting outside the agent context.`);
}

export function assertPublicHttpsUrl(value: string): void {
  const url = new URL(value);
  if (url.protocol !== 'https:') throw new Error('Webhook URL must use HTTPS.');
  const host = url.hostname.toLowerCase();
  if (host === 'localhost' || host.endsWith('.localhost') || host === '0.0.0.0' || host === '::1') throw new Error('Webhook URL cannot target localhost.');
  if (/^127\./.test(host) || /^10\./.test(host) || /^192\.168\./.test(host) || /^169\.254\./.test(host)) throw new Error('Webhook URL cannot target a private/link-local IPv4 address.');
  const m = host.match(/^172\.(\d+)\./); if (m && Number(m[1]) >= 16 && Number(m[1]) <= 31) throw new Error('Webhook URL cannot target a private IPv4 address.');
  if (url.username || url.password) throw new Error('Credentials in webhook URLs are not accepted by this connector.');
}
