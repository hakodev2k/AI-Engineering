import crypto from 'node:crypto';
import type { Config } from './config.js';
import { approvalDigest } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';
export const TOOL_POLICY: Record<string, { risk: Risk; approval: boolean }> = {
  'fly.app.list': { risk: 'READ', approval: false },
  'fly.app.get': { risk: 'READ', approval: false },
  'fly.app.create': { risk: 'WRITE', approval: true },
  'fly.app.delete': { risk: 'DESTRUCTIVE', approval: true },
  'fly.machine.list': { risk: 'READ', approval: false },
  'fly.machine.get': { risk: 'READ', approval: false },
  'fly.machine.start': { risk: 'HIGH_RISK', approval: true },
  'fly.machine.stop': { risk: 'HIGH_RISK', approval: true },
  'fly.machine.delete': { risk: 'DESTRUCTIVE', approval: true },
  'fly.volume.list': { risk: 'READ', approval: false },
  'fly.volume.get': { risk: 'READ', approval: false },
  'fly.volume.create': { risk: 'WRITE', approval: true },
  'fly.volume.delete': { risk: 'DESTRUCTIVE', approval: true }
};

export function assertApproval(config: Config, tool: string, payload: unknown, approvalId?: string) {
  const policy = TOOL_POLICY[tool];
  if (!policy) throw new Error(`Unknown tool policy: ${tool}`);
  if (!policy.approval) return;
  if (!config.requireWriteApproval && policy.risk === 'WRITE') return;
  if (!config.approvalSecret) throw new Error(`${tool} requires FLY_APPROVAL_SECRET`);
  if (!approvalId) throw new Error(`${tool} requires explicit approval`);
  const expected = approvalDigest(config.approvalSecret, tool, payload);
  const a = Buffer.from(approvalId);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error(`Invalid approval for ${tool}`);
}
