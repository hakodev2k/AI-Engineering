import crypto from 'node:crypto';
import type { Config } from './config.js';
import { approvalDigest } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export const TOOL_POLICY: Record<string, Risk> = {
  'clerk.user.list':'READ','clerk.user.get':'READ','clerk.user.create':'WRITE','clerk.user.update':'WRITE','clerk.user.delete':'DESTRUCTIVE',
  'clerk.organization.list':'READ','clerk.organization.get':'READ','clerk.organization.create':'WRITE','clerk.organization.update':'WRITE','clerk.organization.delete':'DESTRUCTIVE',
  'clerk.organization.membership.list':'READ','clerk.organization.membership.create':'HIGH_RISK','clerk.organization.membership.update':'HIGH_RISK','clerk.organization.membership.delete':'DESTRUCTIVE',
  'clerk.organization.invitation.list':'READ','clerk.organization.invitation.create':'HIGH_RISK','clerk.organization.invitation.revoke':'HIGH_RISK'
};

export function assertAllowed(config: Config, tool: string, approval?: string): void {
  const risk = TOOL_POLICY[tool];
  if (!risk) throw new Error(`Unknown tool policy: ${tool}`);
  if (risk === 'DESTRUCTIVE' && !config.allowDestructive) throw new Error(`${tool} is disabled; set CLERK_ALLOW_DESTRUCTIVE=true only with an external approval process`);
  const needsApproval = risk === 'HIGH_RISK' || risk === 'DESTRUCTIVE' || (risk === 'WRITE' && config.requireWriteApproval);
  if (!needsApproval) return;
  if (!config.approvalSecret) throw new Error(`${tool} requires CLERK_APPROVAL_SECRET`);
  if (!approval) throw new Error(`${tool} requires explicit approval`);
  const expected = approvalDigest(config.approvalSecret, tool);
  const a = Buffer.from(approval); const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a,b)) throw new Error(`Invalid approval for ${tool}`);
}
