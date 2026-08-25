import crypto from 'node:crypto';
import type { Config } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';
export const POLICY: Record<string, Risk> = {
  'dropbox.account.whoami': 'READ',
  'dropbox.folder.list': 'READ',
  'dropbox.file.metadata': 'READ',
  'dropbox.search': 'READ',
  'dropbox.shared_link.list': 'READ',
  'dropbox.file.revisions.list': 'READ',
  'dropbox.folder.create': 'WRITE',
  'dropbox.file.create_text': 'WRITE',
  'dropbox.file.copy': 'WRITE',
  'dropbox.file.move': 'WRITE',
  'dropbox.shared_link.create': 'HIGH_RISK',
  'dropbox.file.revision.restore': 'HIGH_RISK',
  'dropbox.file.delete': 'DESTRUCTIVE'
};

export function requiresApproval(tool: string, config: Config): boolean {
  const risk = POLICY[tool];
  return risk === 'HIGH_RISK' || risk === 'DESTRUCTIVE' || (risk === 'WRITE' && config.requireWriteApproval);
}

export function approvalDigest(secret: string, tool: string, args: unknown): string {
  const body = JSON.stringify(args, Object.keys((args ?? {}) as object).sort());
  return crypto.createHmac('sha256', secret).update(`${tool}\n${body}`).digest('hex');
}

export function assertApproval(tool: string, args: unknown, approvalId: string | undefined, config: Config): void {
  if (!requiresApproval(tool, config)) return;
  if (!config.approvalSecret) throw new Error(`${tool} requires DROPBOX_APPROVAL_SECRET`);
  if (!approvalId) throw new Error(`${tool} requires explicit human approval`);
  const expected = approvalDigest(config.approvalSecret, tool, args);
  const a = Buffer.from(approvalId);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error(`Invalid approval for ${tool}`);
}
