import crypto from 'node:crypto';
import type { Config } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export function expectedApproval(secret: string, tool: string) {
  return crypto.createHmac('sha256', secret).update(tool).digest('hex');
}

export function assertPermission(config: Config, tool: string, risk: Risk, approvalId?: string) {
  if (risk === 'READ') return;
  if (!config.enableWrite) throw new Error(`${tool} is disabled: TERRAFORM_CLOUD_ENABLE_WRITE=false`);
  if ((risk === 'HIGH_RISK' || risk === 'DESTRUCTIVE') && !config.enableDestructive) {
    throw new Error(`${tool} is disabled: TERRAFORM_CLOUD_ENABLE_DESTRUCTIVE=false`);
  }
  if (!config.approvalSecret) throw new Error(`${tool} requires TERRAFORM_CLOUD_APPROVAL_SECRET`);
  const expected = expectedApproval(config.approvalSecret, tool);
  if (!approvalId || approvalId.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(approvalId), Buffer.from(expected))) {
    throw new Error(`${tool} requires explicit human approval`);
  }
}
