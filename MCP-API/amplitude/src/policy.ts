import crypto from 'node:crypto';
import { approvalDigest } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';
export const TOOL_POLICY: Record<string, { risk: Risk; approval: boolean }> = {
  'amplitude.event.list': { risk: 'READ', approval: false },
  'amplitude.user.count': { risk: 'READ', approval: false },
  'amplitude.event.segment': { risk: 'READ', approval: false },
  'amplitude.funnel.analyze': { risk: 'READ', approval: false },
  'amplitude.retention.analyze': { risk: 'READ', approval: false },
  'amplitude.chart.get': { risk: 'READ', approval: false },
  'amplitude.user.activity': { risk: 'READ', approval: false },
  'amplitude.user.profile': { risk: 'READ', approval: false },
  'amplitude.event.ingest': { risk: 'WRITE', approval: true }
};

export function assertApproval(tool: string, approvalId: string | undefined, secret?: string) {
  const policy = TOOL_POLICY[tool];
  if (!policy?.approval) return;
  if (!secret) throw new Error(`${tool} requires AMPLITUDE_APPROVAL_SECRET`);
  if (!approvalId) throw new Error(`${tool} requires explicit approval`);
  const expected = approvalDigest(secret, tool);
  const a = Buffer.from(approvalId);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error(`Invalid approval for ${tool}`);
}
