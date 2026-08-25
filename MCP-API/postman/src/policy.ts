import crypto from 'node:crypto';
import type { Config } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export const TOOL_POLICY: Record<string, Risk> = {
  'postman.workspace.list': 'READ',
  'postman.workspace.get': 'READ',
  'postman.workspace.create': 'WRITE',
  'postman.workspace.update': 'WRITE',
  'postman.collection.list': 'READ',
  'postman.collection.get': 'READ',
  'postman.collection.create': 'WRITE',
  'postman.collection.replace': 'WRITE',
  'postman.environment.list': 'READ',
  'postman.environment.get': 'READ',
  'postman.environment.create': 'WRITE',
  'postman.environment.replace': 'WRITE',
  'postman.spec.list': 'READ',
  'postman.spec.get': 'READ',
  'postman.collection.run': 'HIGH_RISK'
};

function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    return `{${Object.keys(obj).sort().map(k => `${JSON.stringify(k)}:${canonical(obj[k])}`).join(',')}}`;
  }
  return JSON.stringify(value) ?? 'null';
}

export function approvalToken(secret: string, tool: string, args: Record<string, unknown>): string {
  const clean = { ...args };
  delete clean.approvalToken;
  return crypto.createHmac('sha256', secret).update(`${tool}\n${canonical(clean)}`).digest('hex');
}

export function assertAllowed(config: Config, tool: string, args: Record<string, unknown>): void {
  const risk = TOOL_POLICY[tool];
  if (!risk) throw new Error(`Unregistered policy for ${tool}`);
  const needsApproval = risk === 'HIGH_RISK' || risk === 'DESTRUCTIVE' || (risk === 'WRITE' && config.writeApproval);
  if (!needsApproval) return;
  if (!config.approvalSecret) throw new Error(`${tool} requires POSTMAN_APPROVAL_SECRET`);
  const supplied = typeof args.approvalToken === 'string' ? args.approvalToken : '';
  if (!supplied) throw new Error(`${tool} requires explicit approval`);
  const expected = approvalToken(config.approvalSecret, tool, args);
  const a = Buffer.from(supplied, 'utf8');
  const b = Buffer.from(expected, 'utf8');
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error(`Invalid approval for ${tool}`);
}
