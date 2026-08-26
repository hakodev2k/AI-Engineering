import crypto from 'node:crypto';
import { approvalDigest, type Config } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export const POLICY: Record<string, { upstream: string; risk: Risk; approval: boolean }> = {
  'honeycomb.environment.list': { upstream: 'list_environments', risk: 'READ', approval: false },
  'honeycomb.dataset.list': { upstream: 'list_datasets', risk: 'READ', approval: false },
  'honeycomb.column.find': { upstream: 'find_columns', risk: 'READ', approval: false },
  'honeycomb.query.run': { upstream: 'run_query', risk: 'READ', approval: false },
  'honeycomb.trace.get': { upstream: 'get_trace', risk: 'READ', approval: false },
  'honeycomb.bubbleup.run': { upstream: 'run_bubbleup', risk: 'READ', approval: false },
  'honeycomb.service-map.get': { upstream: 'get_service_map', risk: 'READ', approval: false },
  'honeycomb.board.create': { upstream: 'create_board', risk: 'WRITE', approval: true },
  'honeycomb.trigger.create': { upstream: 'create_trigger', risk: 'HIGH_RISK', approval: true },
  'honeycomb.slo.update': { upstream: 'update_slo', risk: 'HIGH_RISK', approval: true }
};

export function validatePayload(payload: unknown, config: Pick<Config, 'maxPayloadBytes'>): Record<string, unknown> {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) throw new Error('payload must be a JSON object');
  const text = JSON.stringify(payload);
  if (Buffer.byteLength(text, 'utf8') > config.maxPayloadBytes) throw new Error('payload exceeds configured size limit');
  const forbidden = /(^|_)(token|secret|password|authorization|api_key|apikey)($|_)/i;
  for (const key of Object.keys(payload as Record<string, unknown>)) if (forbidden.test(key)) throw new Error(`credential-like field is forbidden: ${key}`);
  return payload as Record<string, unknown>;
}

export function assertApproval(tool: string, payload: unknown, approval: string | undefined, secret?: string): void {
  const policy = POLICY[tool];
  if (!policy) throw new Error('tool is not allowlisted');
  if (!policy.approval) return;
  if (!secret) throw new Error(`${tool} requires HONEYCOMB_APPROVAL_SECRET`);
  if (!approval) throw new Error(`${tool} requires explicit approval`);
  const expected = approvalDigest(secret, tool, payload);
  const a = Buffer.from(approval, 'utf8');
  const b = Buffer.from(expected, 'utf8');
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error(`invalid approval for ${tool}`);
}
