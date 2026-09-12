import type { OpsLevelConfig, Risk } from './config.js';

export interface Policy { risk: Risk; approval: 'none' | 'required'; }
export const POLICIES: Record<string, Policy> = {
  'opslevel.account.get': { risk: 'READ', approval: 'none' },
  'opslevel.service.list': { risk: 'READ', approval: 'none' },
  'opslevel.service.get': { risk: 'READ', approval: 'none' },
  'opslevel.team.list': { risk: 'READ', approval: 'none' },
  'opslevel.system.list': { risk: 'READ', approval: 'none' },
  'opslevel.domain.list': { risk: 'READ', approval: 'none' },
  'opslevel.integration.list': { risk: 'READ', approval: 'none' },
  'opslevel.service.create': { risk: 'WRITE', approval: 'required' },
  'opslevel.service.update': { risk: 'WRITE', approval: 'required' },
  'opslevel.service.tags.assign': { risk: 'WRITE', approval: 'required' }
};

export function requireApproval(config: OpsLevelConfig, tool: string, approved: boolean): void {
  const policy = POLICIES[tool];
  if (!policy) throw new Error(`Unknown tool policy: ${tool}`);
  if (policy.approval === 'required' && (!config.writeApproved || !approved)) {
    throw new Error(`${tool} requires explicit human approval and OPSLEVEL_WRITE_APPROVED=true`);
  }
}
