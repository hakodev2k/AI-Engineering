import crypto from 'node:crypto';
import { approvalDigest } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export const TOOL_RISK: Record<string, Risk> = {
  'figma.file.get': 'READ',
  'figma.file.nodes': 'READ',
  'figma.image.render': 'READ',
  'figma.image_fills.list': 'READ',
  'figma.comment.list': 'READ',
  'figma.comment.create': 'WRITE',
  'figma.component.list_file': 'READ',
  'figma.component_set.list_file': 'READ',
  'figma.style.list_file': 'READ',
  'figma.variables.local': 'READ',
  'figma.variables.published': 'READ',
  'figma.webhook.list': 'READ',
  'figma.webhook.create': 'HIGH_RISK',
  'figma.webhook.delete': 'DESTRUCTIVE'
};

export function assertApproval(tool: string, approvalId: string | undefined, secret: string | undefined) {
  const risk = TOOL_RISK[tool] ?? 'HIGH_RISK';
  if (risk === 'READ') return;
  if (!secret) throw new Error(`Approval secret is not configured for ${tool}`);
  if (!approvalId) throw new Error(`Explicit human approval is required for ${tool}`);
  const expected = approvalDigest(secret, tool);
  const a = Buffer.from(approvalId, 'utf8');
  const b = Buffer.from(expected, 'utf8');
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error(`Invalid approval for ${tool}`);
}
