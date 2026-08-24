import crypto from 'node:crypto';
import { approvalDigest, MistralConfig } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export const TOOL_RISK: Record<string, Risk> = {
  'mistral.model.list': 'READ',
  'mistral.model.get': 'READ',
  'mistral.chat.complete': 'WRITE',
  'mistral.embedding.create': 'WRITE',
  'mistral.code.complete': 'WRITE',
  'mistral.moderation.text': 'READ',
  'mistral.moderation.chat': 'READ',
  'mistral.ocr.process': 'WRITE',
  'mistral.audio.transcribe': 'WRITE'
};

export function assertApproval(config: MistralConfig, tool: string, approvalId?: string) {
  if (TOOL_RISK[tool] !== 'WRITE' || !config.requireApprovalForWrite) return;
  if (!config.approvalSecret) throw new Error('Approval is required but MISTRAL_APPROVAL_SECRET is not configured');
  if (!approvalId || !/^[a-f0-9]{64}$/i.test(approvalId)) throw new Error(`Explicit approval required for ${tool}`);
  const expected = approvalDigest(config.approvalSecret, tool);
  const a = Buffer.from(expected, 'hex');
  const b = Buffer.from(approvalId, 'hex');
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error(`Invalid approval for ${tool}`);
}
