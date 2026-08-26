import crypto from 'node:crypto';
import { approvalDigest } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export interface ToolPolicy {
  risk: Risk;
  approvalRequired: boolean;
}

export const TOOL_POLICY: Record<string, ToolPolicy> = {
  'circleci.run.list': { risk: 'READ', approvalRequired: false },
  'circleci.run.get': { risk: 'READ', approvalRequired: false },
  'circleci.workflow.list': { risk: 'READ', approvalRequired: false },
  'circleci.workflow.get': { risk: 'READ', approvalRequired: false },
  'circleci.workflow.rerun': { risk: 'HIGH_RISK', approvalRequired: true },
  'circleci.workflow.cancel': { risk: 'HIGH_RISK', approvalRequired: true },
  'circleci.job.list': { risk: 'READ', approvalRequired: false },
  'circleci.job.get': { risk: 'READ', approvalRequired: false },
  'circleci.job.logs': { risk: 'READ', approvalRequired: false },
  'circleci.job.artifacts': { risk: 'READ', approvalRequired: false },
  'circleci.job.tests': { risk: 'READ', approvalRequired: false },
  'circleci.usage.download': { risk: 'READ', approvalRequired: false },
  'circleci.pipeline.get': { risk: 'READ', approvalRequired: false },
  'circleci.pipeline.trigger': { risk: 'WRITE', approvalRequired: true }
};

export function assertApproval(tool: string, args: Record<string, unknown>, approvalToken: string | undefined, secret?: string): void {
  const policy = TOOL_POLICY[tool];
  if (!policy) throw new Error(`Unknown tool policy: ${tool}`);
  if (!policy.approvalRequired) return;
  if (!secret) throw new Error(`${tool} requires CIRCLECI_APPROVAL_SECRET`);
  if (!approvalToken) throw new Error(`${tool} requires explicit human approval`);

  const expected = approvalDigest(secret, tool, args);
  const actualBuffer = Buffer.from(approvalToken);
  const expectedBuffer = Buffer.from(expected);
  if (actualBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(actualBuffer, expectedBuffer)) {
    throw new Error(`Invalid approval token for ${tool}`);
  }
}
