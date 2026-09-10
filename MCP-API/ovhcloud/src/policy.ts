import crypto from 'node:crypto';
import { approvalDigest, type OvhConfig } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export const TOOL_POLICY: Record<string, Risk> = {
  'ovhcloud.account.get': 'READ',
  'ovhcloud.cloud.project.list': 'READ',
  'ovhcloud.cloud.project.get': 'READ',
  'ovhcloud.cloud.instance.list': 'READ',
  'ovhcloud.cloud.instance.get': 'READ',
  'ovhcloud.cloud.instance.reboot': 'HIGH_RISK',
  'ovhcloud.vps.list': 'READ',
  'ovhcloud.vps.get': 'READ',
  'ovhcloud.vps.reboot': 'HIGH_RISK',
  'ovhcloud.domain.list': 'READ',
  'ovhcloud.domain.get': 'READ',
};

export function assertAllowed(config: OvhConfig, tool: string, args: Record<string, unknown>): void {
  const risk = TOOL_POLICY[tool];
  if (!risk) throw new Error('Unknown or unapproved tool');
  if (risk === 'READ') return;
  if (risk === 'HIGH_RISK' && !config.enableHighRisk) throw new Error('HIGH_RISK operations are disabled');
  if (risk === 'DESTRUCTIVE') throw new Error('DESTRUCTIVE operations are not exposed');
  if ((risk === 'WRITE' && !config.requireWriteApproval) || risk === 'READ') return;
  const approval = typeof args.approvalId === 'string' ? args.approvalId : '';
  if (!config.approvalSecret) throw new Error('OVH_APPROVAL_SECRET is required for approval-gated operations');
  const payload = { ...args };
  delete payload.approvalId;
  const expected = approvalDigest(config.approvalSecret, tool, payload);
  const a = Buffer.from(approval);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error('Explicit human approval is required for this exact operation');
}
