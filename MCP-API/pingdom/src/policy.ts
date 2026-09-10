import crypto from 'node:crypto';
import type { Config } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';
export const TOOL_POLICY: Record<string, { risk: Risk; approvalRequired: boolean }> = {
  'pingdom.check.list': { risk: 'READ', approvalRequired: false },
  'pingdom.check.get': { risk: 'READ', approvalRequired: false },
  'pingdom.check.summary': { risk: 'READ', approvalRequired: false },
  'pingdom.probe.list': { risk: 'READ', approvalRequired: false },
  'pingdom.alert.list': { risk: 'READ', approvalRequired: false },
  'pingdom.maintenance.list': { risk: 'READ', approvalRequired: false },
  'pingdom.maintenance.get': { risk: 'READ', approvalRequired: false },
  'pingdom.maintenance.occurrence.list': { risk: 'READ', approvalRequired: false },
  'pingdom.account.credits.get': { risk: 'READ', approvalRequired: false },
  'pingdom.check.create': { risk: 'WRITE', approvalRequired: true },
  'pingdom.check.update': { risk: 'WRITE', approvalRequired: true },
  'pingdom.maintenance.create': { risk: 'WRITE', approvalRequired: true },
  'pingdom.maintenance.update': { risk: 'WRITE', approvalRequired: true },
  'pingdom.check.delete': { risk: 'DESTRUCTIVE', approvalRequired: true },
  'pingdom.maintenance.delete': { risk: 'DESTRUCTIVE', approvalRequired: true }
};

function stable(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.entries(value as Record<string, unknown>).sort(([a],[b]) => a.localeCompare(b)).map(([k,v]) => `${JSON.stringify(k)}:${stable(v)}`).join(',')}}`;
  return JSON.stringify(value);
}

export function approvalDigest(secret: string, tool: string, args: unknown): string {
  return crypto.createHmac('sha256', secret).update(`${tool}\n${stable(args)}`).digest('hex');
}

export function assertPolicy(config: Config, tool: string, args: Record<string, unknown>): void {
  const policy = TOOL_POLICY[tool];
  if (!policy) throw new Error(`Unknown tool policy: ${tool}`);
  if (policy.risk === 'DESTRUCTIVE' && !config.enableDestructive) throw new Error(`${tool} is disabled; set PINGDOM_ENABLE_DESTRUCTIVE=true outside the agent process to enable it`);
  if (!policy.approvalRequired) return;
  const approval = typeof args.approval === 'string' ? args.approval : undefined;
  if (!approval) throw new Error(`${tool} requires explicit human approval`);
  const clean = { ...args }; delete clean.approval;
  const expected = approvalDigest(config.approvalSecret, tool, clean);
  const a = Buffer.from(approval); const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error(`Invalid approval for ${tool}`);
}
