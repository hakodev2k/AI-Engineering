import { config } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export type ToolPolicy = {
  name: string;
  permission: Risk;
  approvalRequired: boolean;
};

export const toolPolicies: ToolPolicy[] = [
  { name: 'hightouch.sync.list', permission: 'READ', approvalRequired: false },
  { name: 'hightouch.sync.get', permission: 'READ', approvalRequired: false },
  { name: 'hightouch.sync.run.list', permission: 'READ', approvalRequired: false },
  { name: 'hightouch.sync.trigger', permission: 'HIGH_RISK', approvalRequired: true },
  { name: 'hightouch.model.list', permission: 'READ', approvalRequired: false },
  { name: 'hightouch.model.get', permission: 'READ', approvalRequired: false },
  { name: 'hightouch.source.list', permission: 'READ', approvalRequired: false },
  { name: 'hightouch.source.get', permission: 'READ', approvalRequired: false },
  { name: 'hightouch.destination.list', permission: 'READ', approvalRequired: false },
  { name: 'hightouch.destination.get', permission: 'READ', approvalRequired: false },
];

export function policyFor(name: string): ToolPolicy {
  const policy = toolPolicies.find((entry) => entry.name === name);
  if (!policy) throw new Error(`Unknown tool policy: ${name}`);
  return policy;
}

export function assertAllowed(name: string, approved = false): void {
  const policy = policyFor(name);
  if (policy.permission === 'READ') return;
  if (policy.permission === 'WRITE' && !config.allowWrite) throw new Error(`${name} is disabled: set HIGHTOUCH_ALLOW_WRITE=true`);
  if (policy.permission === 'HIGH_RISK') {
    if (!config.allowHighRisk) throw new Error(`${name} is disabled: set HIGHTOUCH_ALLOW_HIGH_RISK=true`);
    if (!approved) throw new Error(`${name} requires explicit human approval`);
    return;
  }
  if (policy.permission === 'DESTRUCTIVE') throw new Error(`${name} is disabled by design`);
}
