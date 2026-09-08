import { config } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export type ToolPolicy = {
  risk: Risk;
  permission: string;
  approvalRequired: boolean;
};

export const TOOL_POLICY: Record<string, ToolPolicy> = {
  'akamai.property.list': { risk: 'READ', permission: 'Property Manager: READ', approvalRequired: false },
  'akamai.property.get': { risk: 'READ', permission: 'Property Manager: READ', approvalRequired: false },
  'akamai.property.hostnames.list': { risk: 'READ', permission: 'Property Manager: READ', approvalRequired: false },
  'akamai.activation.list': { risk: 'READ', permission: 'Property Manager: READ', approvalRequired: false },
  'akamai.activation.get': { risk: 'READ', permission: 'Property Manager: READ', approvalRequired: false },
  'akamai.activation.create': { risk: 'HIGH_RISK', permission: 'Property Manager: READ-WRITE', approvalRequired: true },
  'akamai.purge.rate_limit.get': { risk: 'READ', permission: 'Purge Cache: READ-WRITE', approvalRequired: false },
  'akamai.purge.url.invalidate': { risk: 'WRITE', permission: 'Purge Cache: READ-WRITE', approvalRequired: true },
  'akamai.purge.cpcode.invalidate': { risk: 'WRITE', permission: 'Purge Cache: READ-WRITE', approvalRequired: true },
  'akamai.purge.tag.invalidate': { risk: 'WRITE', permission: 'Purge Cache: READ-WRITE', approvalRequired: true },
};

export function assertAllowed(toolName: string, approved: boolean | undefined): void {
  const policy = TOOL_POLICY[toolName];
  if (!policy) throw new Error(`Unknown tool policy: ${toolName}`);
  if (policy.risk === 'READ') return;
  if (policy.risk === 'WRITE' && !config.allowWrite) throw new Error('WRITE operations are disabled by AKAMAI_ALLOW_WRITE');
  if (policy.risk === 'HIGH_RISK' && !config.allowHighRisk) throw new Error('HIGH_RISK operations are disabled by AKAMAI_ALLOW_HIGH_RISK');
  if (policy.risk === 'DESTRUCTIVE' && !config.allowDestructive) throw new Error('DESTRUCTIVE operations are disabled by AKAMAI_ALLOW_DESTRUCTIVE');
  if (policy.approvalRequired && approved !== true) throw new Error(`Explicit human approval is required for ${toolName}`);
}
