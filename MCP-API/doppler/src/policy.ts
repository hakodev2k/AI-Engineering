import crypto from 'node:crypto';
import type { DopplerConfig } from './config.js';
import { approvalDigest } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export const TOOL_POLICY: Record<string, { risk: Risk; approval: boolean; requiresWrite?: boolean }> = {
  'doppler.project.list': { risk: 'READ', approval: false },
  'doppler.project.get': { risk: 'READ', approval: false },
  'doppler.config.list': { risk: 'READ', approval: false },
  'doppler.config.get': { risk: 'READ', approval: false },
  'doppler.secret.names': { risk: 'READ', approval: false },
  'doppler.secret.list': { risk: 'HIGH_RISK', approval: true },
  'doppler.secret.get': { risk: 'HIGH_RISK', approval: true },
  'doppler.secret.download': { risk: 'HIGH_RISK', approval: true },
  'doppler.secret.update': { risk: 'HIGH_RISK', approval: true, requiresWrite: true }
};

export function assertAllowed(cfg: DopplerConfig, tool: string, approvalId?: string) {
  const policy = TOOL_POLICY[tool];
  if (!policy) throw new Error(`Unknown tool policy: ${tool}`);
  if (policy.requiresWrite && cfg.readOnly) throw new Error(`${tool} is disabled because DOPPLER_READ_ONLY=true`);
  if (!policy.approval) return;
  if (!cfg.approvalSecret) throw new Error(`${tool} requires DOPPLER_APPROVAL_SECRET`);
  if (!approvalId) throw new Error(`${tool} requires explicit approval`);
  const expected = approvalDigest(cfg.approvalSecret, tool);
  const a = Buffer.from(approvalId);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error(`Invalid approval for ${tool}`);
}
