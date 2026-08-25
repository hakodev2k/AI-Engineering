import crypto from 'node:crypto';
import { approvalDigest, type OktaConfig } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';
export type Policy = { risk: Risk; approvalRequired: boolean; requiredScope: string };

export const TOOL_POLICY: Record<string, Policy> = {
  'okta.user.search': { risk: 'READ', approvalRequired: false, requiredScope: 'okta.users.read' },
  'okta.user.get': { risk: 'READ', approvalRequired: false, requiredScope: 'okta.users.read' },
  'okta.user.create': { risk: 'HIGH_RISK', approvalRequired: true, requiredScope: 'okta.users.manage' },
  'okta.user.update': { risk: 'WRITE', approvalRequired: true, requiredScope: 'okta.users.manage' },
  'okta.user.suspend': { risk: 'HIGH_RISK', approvalRequired: true, requiredScope: 'okta.users.manage' },
  'okta.user.unsuspend': { risk: 'HIGH_RISK', approvalRequired: true, requiredScope: 'okta.users.manage' },
  'okta.group.list': { risk: 'READ', approvalRequired: false, requiredScope: 'okta.groups.read' },
  'okta.group.get': { risk: 'READ', approvalRequired: false, requiredScope: 'okta.groups.read' },
  'okta.group.create': { risk: 'WRITE', approvalRequired: true, requiredScope: 'okta.groups.manage' },
  'okta.group.members.list': { risk: 'READ', approvalRequired: false, requiredScope: 'okta.groups.read' },
  'okta.group.member.add': { risk: 'HIGH_RISK', approvalRequired: true, requiredScope: 'okta.groups.manage' },
  'okta.group.member.remove': { risk: 'HIGH_RISK', approvalRequired: true, requiredScope: 'okta.groups.manage' },
  'okta.application.list': { risk: 'READ', approvalRequired: false, requiredScope: 'okta.apps.read' },
  'okta.application.get': { risk: 'READ', approvalRequired: false, requiredScope: 'okta.apps.read' },
  'okta.system_log.query': { risk: 'READ', approvalRequired: false, requiredScope: 'okta.logs.read' }
};

export function assertApproved(config: OktaConfig, tool: string, payload: Record<string, unknown>, approvalId?: string): void {
  const policy = TOOL_POLICY[tool];
  if (!policy) throw new Error(`Unknown tool policy: ${tool}`);
  if (!policy.approvalRequired) return;
  if (!config.approvalSecret) throw new Error(`${tool} requires OKTA_APPROVAL_SECRET`);
  if (!approvalId) throw new Error(`${tool} requires explicit human approval`);
  const expected = approvalDigest(config.approvalSecret, tool, payload);
  const actual = Buffer.from(approvalId, 'utf8');
  const expectedBuffer = Buffer.from(expected, 'utf8');
  if (actual.length !== expectedBuffer.length || !crypto.timingSafeEqual(actual, expectedBuffer)) throw new Error(`Invalid approval token for ${tool}`);
}

export function policyFor(tool: string): Policy {
  const policy = TOOL_POLICY[tool];
  if (!policy) throw new Error(`No policy registered for ${tool}`);
  return policy;
}
