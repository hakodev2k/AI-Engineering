import crypto from 'node:crypto';
import { approvalDigest, Config } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export const TOOL_POLICY: Record<string, { risk: Risk; approval: boolean }> = {
  'box.item.search': { risk: 'READ', approval: false },
  'box.folder.list': { risk: 'READ', approval: false },
  'box.file.get': { risk: 'READ', approval: false },
  'box.folder.get': { risk: 'READ', approval: false },
  'box.folder.create': { risk: 'WRITE', approval: true },
  'box.file.upload': { risk: 'WRITE', approval: true },
  'box.file.update': { risk: 'WRITE', approval: true },
  'box.comment.list': { risk: 'READ', approval: false },
  'box.comment.create': { risk: 'WRITE', approval: true },
  'box.webhook.list': { risk: 'READ', approval: false },
  'box.webhook.create': { risk: 'HIGH_RISK', approval: true },
  'box.webhook.delete': { risk: 'DESTRUCTIVE', approval: true }
};

export function assertApproved(tool: string, approvalId: string | undefined, config: Config): void {
  const policy = TOOL_POLICY[tool];
  if (!policy) throw new Error(`Unknown tool policy: ${tool}`);
  if (policy.risk === 'DESTRUCTIVE' && !config.destructiveEnabled) throw new Error(`${tool} is disabled; set BOX_ENABLE_DESTRUCTIVE=true to enable`);
  if (!policy.approval) return;
  if (!config.approvalSecret) throw new Error(`${tool} requires BOX_APPROVAL_SECRET`);
  if (!approvalId) throw new Error(`${tool} requires explicit approval`);
  const expected = approvalDigest(config.approvalSecret, tool);
  const a = Buffer.from(approvalId);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error(`Invalid approval for ${tool}`);
}
