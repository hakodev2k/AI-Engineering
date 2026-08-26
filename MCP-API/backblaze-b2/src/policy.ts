import crypto from 'node:crypto';
import { approvalDigest, type Config } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'DESTRUCTIVE';

export const TOOL_POLICY: Record<string, { risk: Risk; approval: boolean }> = {
  'backblaze.bucket.list': { risk: 'READ', approval: false },
  'backblaze.bucket.head': { risk: 'READ', approval: false },
  'backblaze.object.list': { risk: 'READ', approval: false },
  'backblaze.object.version.list': { risk: 'READ', approval: false },
  'backblaze.object.head': { risk: 'READ', approval: false },
  'backblaze.object.read_text': { risk: 'READ', approval: false },
  'backblaze.object.presign_download': { risk: 'READ', approval: false },
  'backblaze.object.presign_upload': { risk: 'WRITE', approval: true },
  'backblaze.object.write_text': { risk: 'WRITE', approval: true },
  'backblaze.object.copy': { risk: 'WRITE', approval: true },
  'backblaze.object.delete': { risk: 'DESTRUCTIVE', approval: true }
};

export function assertApproval(config: Config, tool: string, canonicalInput: string, approval?: string) {
  const policy = TOOL_POLICY[tool];
  if (!policy) throw new Error(`Unknown tool policy: ${tool}`);
  if (!policy.approval || (!config.requireWriteApproval && policy.risk === 'WRITE')) return;
  if (!config.approvalSecret) throw new Error(`${tool} requires B2_APPROVAL_SECRET`);
  if (!approval) throw new Error(`${tool} requires explicit approval`);
  const expected = approvalDigest(config.approvalSecret, tool, canonicalInput);
  const a = Buffer.from(approval);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error(`Invalid approval for ${tool}`);
}
