import crypto from 'node:crypto';
import { approvalDigest, type Config } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export const TOOL_POLICY: Record<string, { risk: Risk; approval: boolean }> = {
  'snyk.org.list': { risk: 'READ', approval: false },
  'snyk.project.list': { risk: 'READ', approval: false },
  'snyk.project.get': { risk: 'READ', approval: false },
  'snyk.issue.list': { risk: 'READ', approval: false },
  'snyk.issue.get': { risk: 'READ', approval: false },
  'snyk.project.sbom.get': { risk: 'READ', approval: false },
  'snyk.scan.sca': { risk: 'HIGH_RISK', approval: true },
  'snyk.scan.code': { risk: 'HIGH_RISK', approval: true },
  'snyk.scan.iac': { risk: 'HIGH_RISK', approval: true },
  'snyk.scan.container': { risk: 'HIGH_RISK', approval: true },
  'snyk.scan.sbom': { risk: 'HIGH_RISK', approval: true },
  'snyk.aibom.create': { risk: 'HIGH_RISK', approval: true }
};

export function assertApproval(tool: string, payload: unknown, approvalId: string | undefined, config: Config): void {
  const policy = TOOL_POLICY[tool];
  if (!policy) throw new Error(`Unknown tool policy: ${tool}`);
  if (!policy.approval) return;
  if (!config.SNYK_APPROVAL_SECRET) throw new Error(`${tool} requires SNYK_APPROVAL_SECRET`);
  if (!approvalId) throw new Error(`${tool} requires explicit human approval`);
  const expected = approvalDigest(config.SNYK_APPROVAL_SECRET, tool, payload);
  const a = Buffer.from(approvalId);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error(`Invalid approval for ${tool}`);
}
