import crypto from 'node:crypto';
import { approvalDigest, type Config } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export const TOOL_POLICY: Record<string, { risk: Risk; approval: boolean }> = {
  'launchdarkly.project.list': { risk: 'READ', approval: false },
  'launchdarkly.project.get': { risk: 'READ', approval: false },
  'launchdarkly.environment.list': { risk: 'READ', approval: false },
  'launchdarkly.flag.list': { risk: 'READ', approval: false },
  'launchdarkly.flag.get': { risk: 'READ', approval: false },
  'launchdarkly.flag.create': { risk: 'WRITE', approval: true },
  'launchdarkly.flag.update': { risk: 'HIGH_RISK', approval: true },
  'launchdarkly.flag.delete': { risk: 'DESTRUCTIVE', approval: true },
  'launchdarkly.segment.list': { risk: 'READ', approval: false },
  'launchdarkly.segment.get': { risk: 'READ', approval: false },
  'launchdarkly.segment.create': { risk: 'WRITE', approval: true },
  'launchdarkly.segment.update': { risk: 'HIGH_RISK', approval: true },
  'launchdarkly.webhook.list': { risk: 'READ', approval: false },
  'launchdarkly.webhook.create': { risk: 'HIGH_RISK', approval: true },
  'launchdarkly.webhook.delete': { risk: 'DESTRUCTIVE', approval: true }
};

export function assertAllowed(tool: string, approvalId: string | undefined, config: Config): void {
  const policy = TOOL_POLICY[tool];
  if (!policy) throw new Error(`Unknown tool policy: ${tool}`);
  if (policy.risk === 'DESTRUCTIVE' && !config.allowDestructive) {
    throw new Error(`${tool} is disabled; set LAUNCHDARKLY_ALLOW_DESTRUCTIVE=true to enable it`);
  }
  if (!policy.approval) return;
  if (!config.approvalSecret) throw new Error(`${tool} requires LAUNCHDARKLY_APPROVAL_SECRET`);
  if (!approvalId) throw new Error(`${tool} requires explicit human approval`);
  const expected = approvalDigest(config.approvalSecret, tool);
  const a = Buffer.from(approvalId);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error(`Invalid approval for ${tool}`);
}
