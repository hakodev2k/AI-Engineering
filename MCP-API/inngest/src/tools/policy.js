import crypto from 'node:crypto';
import { approvalDigest } from '../auth/config.js';

export const TOOL_POLICY = Object.freeze({
  'inngest.app.list': { risk: 'READ', approval: false },
  'inngest.app.get': { risk: 'READ', approval: false },
  'inngest.function.list': { risk: 'READ', approval: false },
  'inngest.function.get': { risk: 'READ', approval: false },
  'inngest.run.list': { risk: 'READ', approval: false },
  'inngest.run.get': { risk: 'READ', approval: false },
  'inngest.run.trace.get': { risk: 'READ', approval: false },
  'inngest.event.runs.list': { risk: 'READ', approval: false },
  'inngest.environment.list': { risk: 'READ', approval: false },
  'inngest.insights.table.list': { risk: 'READ', approval: false },
  'inngest.event.send': { risk: 'HIGH_RISK', approval: true },
  'inngest.function.invoke': { risk: 'HIGH_RISK', approval: true },
  'inngest.run.rerun': { risk: 'HIGH_RISK', approval: true },
  'inngest.run.cancel': { risk: 'HIGH_RISK', approval: true }
});

export function payloadWithoutApproval(args = {}) {
  const { approvalToken: _approvalToken, ...payload } = args;
  return payload;
}
export function authorize(config, toolName, payload, approvalToken) {
  const policy = TOOL_POLICY[toolName];
  if (!policy) throw new Error(`Unknown tool: ${toolName}`);
  const required = policy.risk === 'HIGH_RISK' || (policy.risk === 'WRITE' && config.requireWriteApproval);
  if (!required) return;
  if (!config.approvalSecret) throw new Error(`${toolName} requires INNGEST_APPROVAL_SECRET`);
  if (!approvalToken) throw new Error(`${toolName} requires explicit approvalToken`);
  const expected = Buffer.from(approvalDigest(config.approvalSecret, toolName, payload));
  const actual = Buffer.from(approvalToken);
  if (expected.length !== actual.length || !crypto.timingSafeEqual(expected, actual)) throw new Error(`Invalid approvalToken for ${toolName}`);
}
