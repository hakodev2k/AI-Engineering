import crypto from 'node:crypto';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export const TOOL_RISK: Record<string, Risk> = {
  'gemini.model.list': 'READ',
  'gemini.model.get': 'READ',
  'gemini.token.count': 'READ',
  'gemini.file.list': 'READ',
  'gemini.file.get': 'READ',
  'gemini.content.generate': 'WRITE',
  'gemini.embedding.create': 'WRITE',
  'gemini.file.upload': 'HIGH_RISK',
  'gemini.file.delete': 'DESTRUCTIVE'
};

export function approvalDigest(secret: string, tool: string): string {
  return crypto.createHmac('sha256', secret).update(tool).digest('hex');
}

export function assertApproval(tool: string, approvalId: string | undefined, secret: string | undefined): void {
  if (!secret) throw new Error(`${tool} requires GEMINI_APPROVAL_SECRET`);
  if (!approvalId) throw new Error(`${tool} requires explicit approval`);
  const expected = approvalDigest(secret, tool);
  const a = Buffer.from(approvalId);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error(`Invalid approval for ${tool}`);
}
