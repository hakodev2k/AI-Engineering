import crypto from 'node:crypto';
import { approvalDigest } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export const TOOL_POLICY: Record<string, { risk: Risk; approval: boolean }> = {
  'looker.model.list': { risk: 'READ', approval: false },
  'looker.explore.get': { risk: 'READ', approval: false },
  'looker.query.run': { risk: 'READ', approval: false },
  'looker.look.get': { risk: 'READ', approval: false },
  'looker.dashboard.get': { risk: 'READ', approval: false },
  'looker.content.search': { risk: 'READ', approval: false },
  'looker.scheduled_plan.search': { risk: 'READ', approval: false },
  'looker.scheduled_plan.get': { risk: 'READ', approval: false },
  'looker.scheduled_plan.create': { risk: 'HIGH_RISK', approval: true },
  'looker.scheduled_plan.run': { risk: 'HIGH_RISK', approval: true },
  'looker.scheduled_plan.delete': { risk: 'DESTRUCTIVE', approval: true }
};

export function assertApproval(tool: string, approvalId: string | undefined, secret?: string) {
  const policy = TOOL_POLICY[tool];
  if (!policy?.approval) return;
  if (!secret) throw new Error(`${tool} requires LOOKER_APPROVAL_SECRET`);
  if (!approvalId) throw new Error(`${tool} requires explicit approval`);
  const expected = approvalDigest(secret, tool);
  const a = Buffer.from(approvalId);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error(`Invalid approval for ${tool}`);
}
