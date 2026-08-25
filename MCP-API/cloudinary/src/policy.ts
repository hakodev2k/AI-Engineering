import crypto from 'node:crypto';
import { approvalDigest } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';
export const TOOL_POLICY: Record<string, { risk: Risk; approval: boolean }> = {
  'cloudinary.asset.list': { risk: 'READ', approval: false },
  'cloudinary.asset.get': { risk: 'READ', approval: false },
  'cloudinary.asset.search': { risk: 'READ', approval: false },
  'cloudinary.folder.list': { risk: 'READ', approval: false },
  'cloudinary.tag.list': { risk: 'READ', approval: false },
  'cloudinary.usage.get': { risk: 'READ', approval: false },
  'cloudinary.transformation.url': { risk: 'READ', approval: false },
  'cloudinary.asset.upload': { risk: 'WRITE', approval: true },
  'cloudinary.asset.update': { risk: 'WRITE', approval: true },
  'cloudinary.asset.rename': { risk: 'HIGH_RISK', approval: true },
  'cloudinary.asset.delete': { risk: 'DESTRUCTIVE', approval: true }
};

export function assertApproval(tool: string, approvalId: string | undefined, secret?: string) {
  const policy = TOOL_POLICY[tool];
  if (!policy) throw new Error(`Unknown tool policy: ${tool}`);
  if (!policy.approval) return;
  if (!secret) throw new Error(`${tool} requires CLOUDINARY_APPROVAL_SECRET`);
  if (!approvalId) throw new Error(`${tool} requires explicit approval`);
  const expected = approvalDigest(secret, tool);
  const a = Buffer.from(approvalId);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error(`Invalid approval for ${tool}`);
}
