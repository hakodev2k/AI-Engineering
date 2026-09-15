export type Risk = 'READ'|'WRITE'|'HIGH_RISK'|'DESTRUCTIVE';
export class ApprovalError extends Error {}
export function requireApproval(risk: Risk, approved: boolean, writeApprovalRequired: boolean, destructiveEnabled: boolean) {
  if (risk === 'READ') return;
  if (risk === 'DESTRUCTIVE' && !destructiveEnabled) throw new ApprovalError('Destructive operations are disabled');
  if ((risk === 'HIGH_RISK' || risk === 'DESTRUCTIVE' || (risk === 'WRITE' && writeApprovalRequired)) && !approved) {
    throw new ApprovalError(`Explicit human approval required for ${risk} operation`);
  }
}
export function safeWebhookTarget(raw: string): string {
  const u = new URL(raw);
  if (u.protocol !== 'https:') throw new Error('Webhook target must use HTTPS');
  if (u.port && u.port !== '443') throw new Error('Webhook target must use standard HTTPS port 443');
  const h = u.hostname.toLowerCase();
  if (h === 'localhost' || h === '127.0.0.1' || h === '::1' || h.endsWith('.local')) throw new Error('Local webhook targets are forbidden');
  return u.toString();
}
