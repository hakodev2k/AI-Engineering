import crypto from 'node:crypto';
import type { Config } from './config.js';
import { approvalDigest } from './config.js';

export type Risk = 'READ'|'WRITE'|'HIGH_RISK'|'DESTRUCTIVE';

export const TOOL_RISK: Record<string,Risk> = {
  'contentstack.content_type.list':'READ',
  'contentstack.content_type.get':'READ',
  'contentstack.entry.list':'READ',
  'contentstack.entry.get':'READ',
  'contentstack.entry.create':'WRITE',
  'contentstack.entry.update':'WRITE',
  'contentstack.entry.publish':'HIGH_RISK',
  'contentstack.entry.unpublish':'HIGH_RISK',
  'contentstack.entry.delete':'DESTRUCTIVE',
  'contentstack.asset.list':'READ',
  'contentstack.asset.get':'READ',
  'contentstack.environment.list':'READ',
  'contentstack.workflow.list':'READ'
};

export function enforcePolicy(config:Config, tool:string, args:Record<string,unknown>):void {
  const risk = TOOL_RISK[tool];
  if (!risk) throw new Error('Unknown tool');
  if (risk === 'READ') return;
  if (risk === 'DESTRUCTIVE' && !config.enableDestructive) throw new Error('Destructive operations are disabled');
  if (risk === 'WRITE' && !config.requireWriteApproval) return;
  if (!config.approvalSecret) throw new Error('CONTENTSTACK_APPROVAL_SECRET is required for this operation');
  const supplied = String(args.approvalToken ?? '');
  const expected = approvalDigest(config.approvalSecret, tool, args);
  const a = Buffer.from(supplied, 'hex');
  const b = Buffer.from(expected, 'hex');
  if (a.length !== b.length || a.length === 0 || !crypto.timingSafeEqual(a,b)) throw new Error('Invalid or missing human approval');
}
