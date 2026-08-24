import crypto from 'node:crypto';
import { GroqConfig } from './config.js';

function expected(secret: string, tool: string) {
  return crypto.createHmac('sha256', secret).update(tool).digest('hex');
}

export function assertApproval(tool: string, approvalId: string | undefined, config: GroqConfig, alwaysRequired = false) {
  if (!alwaysRequired && !config.requireWriteApproval) return;
  if (!config.approvalSecret) throw new Error(`Approval required for ${tool}, but GROQ_APPROVAL_SECRET is not configured`);
  if (!approvalId) throw new Error(`Approval required for ${tool}`);
  const a = Buffer.from(approvalId);
  const b = Buffer.from(expected(config.approvalSecret, tool));
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error(`Invalid approval for ${tool}`);
}

export function assertDestructiveEnabled(config: GroqConfig) {
  if (!config.enableDestructive) throw new Error('Destructive Groq tools are disabled; set GROQ_ENABLE_DESTRUCTIVE=true to enable them');
}

export function approvalDigest(secret: string, tool: string) {
  return expected(secret, tool);
}
