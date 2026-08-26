import crypto from 'node:crypto';
import { approvalDigest, type Config } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';
export const POLICY: Record<string, { risk: Risk; approval: 'none'|'configurable'|'required' }> = {
  'fastly.service.list': { risk:'READ', approval:'none' },
  'fastly.service.get': { risk:'READ', approval:'none' },
  'fastly.version.list': { risk:'READ', approval:'none' },
  'fastly.version.get': { risk:'READ', approval:'none' },
  'fastly.version.validate': { risk:'READ', approval:'none' },
  'fastly.version.clone': { risk:'WRITE', approval:'configurable' },
  'fastly.version.activate': { risk:'HIGH_RISK', approval:'required' },
  'fastly.domain.list': { risk:'READ', approval:'none' },
  'fastly.domain.check': { risk:'READ', approval:'none' },
  'fastly.stats.summary': { risk:'READ', approval:'none' },
  'fastly.cache.purge_url': { risk:'HIGH_RISK', approval:'required' },
  'fastly.cache.purge_key': { risk:'HIGH_RISK', approval:'required' },
  'fastly.cache.purge_all': { risk:'DESTRUCTIVE', approval:'required' }
};

export function assertApproval(cfg: Config, tool: string, payload: unknown, approvalId?: string) {
  const p = POLICY[tool]; if (!p) throw new Error('Unknown tool policy');
  const needed = p.approval === 'required' || (p.approval === 'configurable' && cfg.requireWriteApproval);
  if (!needed) return;
  if (!cfg.approvalSecret) throw new Error(`${tool} requires FASTLY_APPROVAL_SECRET`);
  if (!approvalId) throw new Error(`${tool} requires explicit human approval`);
  const expected = approvalDigest(cfg.approvalSecret, tool, payload);
  const a=Buffer.from(approvalId), b=Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a,b)) throw new Error(`Invalid approval for ${tool}`);
}
