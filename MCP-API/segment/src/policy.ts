import crypto from 'node:crypto';
import { approvalDigest, SegmentConfig } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export const TOOL_POLICY: Record<string, { risk: Risk; approval: boolean }> = {
  'segment.workspace.get': { risk: 'READ', approval: false },
  'segment.source.list': { risk: 'READ', approval: false },
  'segment.source.get': { risk: 'READ', approval: false },
  'segment.source.create': { risk: 'WRITE', approval: true },
  'segment.destination.list': { risk: 'READ', approval: false },
  'segment.destination.get': { risk: 'READ', approval: false },
  'segment.destination.update': { risk: 'WRITE', approval: true },
  'segment.catalog.source.list': { risk: 'READ', approval: false },
  'segment.catalog.destination.list': { risk: 'READ', approval: false },
  'segment.tracking_plan.list': { risk: 'READ', approval: false },
  'segment.tracking_plan.get': { risk: 'READ', approval: false },
  'segment.tracking_plan.create': { risk: 'WRITE', approval: true },
  'segment.tracking_plan.update': { risk: 'WRITE', approval: true },
  'segment.tracking_plan.delete': { risk: 'DESTRUCTIVE', approval: true }
};

export function assertApproval(config: SegmentConfig, tool: string, payload: unknown, approvalId?: string) {
  const policy = TOOL_POLICY[tool];
  if (!policy?.approval || (!config.requireWriteApproval && policy.risk === 'WRITE')) return;
  if (!config.approvalSecret) throw new Error(`${tool} requires SEGMENT_APPROVAL_SECRET`);
  if (!approvalId) throw new Error(`${tool} requires explicit approval`);
  const expected = approvalDigest(config.approvalSecret, tool, payload);
  const a = Buffer.from(approvalId);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error(`Invalid approval for ${tool}`);
}
