import crypto from 'node:crypto';
import { approvalDigest } from '../auth/config.js';

export const POLICY = Object.freeze({
  'incident-io.incident.list': { risk: 'READ', approval: false },
  'incident-io.incident.get': { risk: 'READ', approval: false },
  'incident-io.incident.stats': { risk: 'READ', approval: false },
  'incident-io.incident.create': { risk: 'WRITE', approval: true },
  'incident-io.incident.update': { risk: 'HIGH_RISK', approval: true },
  'incident-io.incident.update_history.list': { risk: 'READ', approval: false },
  'incident-io.follow_up.list': { risk: 'READ', approval: false },
  'incident-io.follow_up.create': { risk: 'WRITE', approval: true },
  'incident-io.alert.list': { risk: 'READ', approval: false },
  'incident-io.alert.get': { risk: 'READ', approval: false },
  'incident-io.alert.stats': { risk: 'READ', approval: false },
  'incident-io.escalation.list': { risk: 'READ', approval: false },
  'incident-io.escalation.get': { risk: 'READ', approval: false },
  'incident-io.escalation_path.list': { risk: 'READ', approval: false },
  'incident-io.escalation_path.get': { risk: 'READ', approval: false },
  'incident-io.escalation.respond': { risk: 'HIGH_RISK', approval: true },
  'incident-io.schedule.list': { risk: 'READ', approval: false },
  'incident-io.schedule.get': { risk: 'READ', approval: false },
  'incident-io.team.list': { risk: 'READ', approval: false },
  'incident-io.team.get': { risk: 'READ', approval: false }
});

export function splitApproval(args = {}) {
  const { approval_token: approvalToken, ...payload } = args;
  return { approvalToken, payload };
}

export function authorize(config, toolName, payload, approvalToken) {
  const policy = POLICY[toolName];
  if (!policy) throw new Error(`Unknown tool: ${toolName}`);
  if (policy.risk === 'HIGH_RISK' && !config.highRiskEnabled) throw new Error(`${toolName} is disabled; set INCIDENT_IO_ENABLE_HIGH_RISK=true`);
  if (!policy.approval) return;
  if (!config.approvalSecret) throw new Error(`${toolName} requires INCIDENT_IO_APPROVAL_SECRET`);
  if (!approvalToken || !/^[a-f0-9]{64}$/.test(approvalToken)) throw new Error(`${toolName} requires a 64-character approval_token`);
  const expected = Buffer.from(approvalDigest(config.approvalSecret, toolName, payload), 'utf8');
  const actual = Buffer.from(approvalToken, 'utf8');
  if (expected.length !== actual.length || !crypto.timingSafeEqual(expected, actual)) throw new Error(`Invalid approval_token for ${toolName}`);
}

export function addApprovalSchema(definition) {
  const policy = POLICY[definition.name];
  if (!policy?.approval) return definition;
  const schema = structuredClone(definition.inputSchema);
  schema.properties ||= {};
  schema.properties.approval_token = { type: 'string', pattern: '^[a-f0-9]{64}$', minLength: 64, maxLength: 64, description: 'Connector-local payload-bound approval token. Never forwarded upstream.' };
  schema.required = [...new Set([...(schema.required || []), 'approval_token'])];
  return { ...definition, inputSchema: schema, description: `${definition.description} Risk: ${policy.risk}. Explicit approval required.` };
}
