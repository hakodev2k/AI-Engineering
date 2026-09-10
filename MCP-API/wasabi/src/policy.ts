import type { Config } from './config.js';
import { verifyApproval } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export const TOOL_RISK: Record<string, Risk> = {
  'wasabi.bucket.list': 'READ',
  'wasabi.bucket.location': 'READ',
  'wasabi.bucket.create': 'WRITE',
  'wasabi.bucket.delete': 'DESTRUCTIVE',
  'wasabi.object.list': 'READ',
  'wasabi.object.metadata': 'READ',
  'wasabi.object.read_text': 'READ',
  'wasabi.object.put_text': 'WRITE',
  'wasabi.object.copy': 'WRITE',
  'wasabi.object.delete': 'DESTRUCTIVE',
  'wasabi.object.presign_get': 'HIGH_RISK',
  'wasabi.object.presign_put': 'HIGH_RISK'
};

export function assertAllowed(config: Config, tool: string, args: Record<string, unknown>): void {
  const risk = TOOL_RISK[tool];
  if (!risk) throw new Error(`Unknown tool: ${tool}`);
  if (risk === 'READ') return;
  if ((risk === 'WRITE' || risk === 'HIGH_RISK') && !config.allowWrite) throw new Error(`${tool} is disabled; set WASABI_ALLOW_WRITE=true outside model context`);
  if (risk === 'DESTRUCTIVE' && !config.allowDestructive) throw new Error(`${tool} is destructive and disabled by default; set WASABI_ALLOW_DESTRUCTIVE=true outside model context`);
  const token = typeof args.approvalToken === 'string' ? args.approvalToken : undefined;
  if (!verifyApproval(config.approvalSecret, tool, args, token)) throw new Error(`${tool} requires valid exact-payload human approval`);
}

export function stripApproval<T extends Record<string, unknown>>(args: T): Omit<T, 'approvalToken'> {
  const { approvalToken: _approvalToken, ...rest } = args;
  return rest;
}
