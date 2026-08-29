import crypto from 'node:crypto';
import { approvalDigest } from '../auth/config.js';
export const TOOL_POLICY = Object.freeze({
  'airbyte.workspace.list': { risk: 'READ', approval: false },
  'airbyte.source.list': { risk: 'READ', approval: false }, 'airbyte.source.get': { risk: 'READ', approval: false },
  'airbyte.destination.list': { risk: 'READ', approval: false }, 'airbyte.destination.get': { risk: 'READ', approval: false },
  'airbyte.connection.list': { risk: 'READ', approval: false }, 'airbyte.connection.get': { risk: 'READ', approval: false },
  'airbyte.stream.list': { risk: 'READ', approval: false }, 'airbyte.job.list': { risk: 'READ', approval: false }, 'airbyte.job.get': { risk: 'READ', approval: false },
  'airbyte.job.sync': { risk: 'WRITE', approval: true }, 'airbyte.job.reset': { risk: 'HIGH_RISK', approval: true }, 'airbyte.job.cancel': { risk: 'HIGH_RISK', approval: true }
});
export function authorize(config, tool, payload, token) {
  const p = TOOL_POLICY[tool]; if (!p) throw new Error(`Unknown tool: ${tool}`); if (!p.approval) return;
  if (!config.approvalSecret) throw new Error(`${tool} requires AIRBYTE_APPROVAL_SECRET`);
  if (!token) throw new Error(`${tool} requires explicit approval_token`);
  const expected = Buffer.from(approvalDigest(config.approvalSecret, tool, payload)); const got = Buffer.from(token);
  if (expected.length !== got.length || !crypto.timingSafeEqual(expected, got)) throw new Error(`Invalid approval_token for ${tool}`);
}
