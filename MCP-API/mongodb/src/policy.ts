import crypto from 'node:crypto';
import { approvalDigest, ConnectorConfig } from './config.js';

export function assertWriteEnabled(config: ConnectorConfig) {
  if (!config.allowWrites) throw new Error('Write tools are disabled. Set MONGODB_CONNECTOR_ALLOW_WRITES=true to enable them.');
}

export function assertApproval(config: ConnectorConfig, tool: string, approvalId?: string) {
  assertWriteEnabled(config);
  if (!config.approvalSecret) throw new Error('Approval secret is not configured');
  if (!approvalId) throw new Error(`Explicit human approval is required for ${tool}`);
  const expected = approvalDigest(config.approvalSecret, tool);
  const a = Buffer.from(approvalId);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error(`Invalid approval for ${tool}`);
}
