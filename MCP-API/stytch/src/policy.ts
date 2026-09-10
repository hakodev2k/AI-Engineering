import crypto from 'node:crypto';
import type { Config } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export const TOOL_RISK: Record<string, Risk> = {
  'stytch.organization.search': 'READ',
  'stytch.organization.get': 'READ',
  'stytch.organization.create': 'WRITE',
  'stytch.organization.update': 'WRITE',
  'stytch.member.search': 'READ',
  'stytch.member.get': 'READ',
  'stytch.member.create': 'HIGH_RISK',
  'stytch.member.update': 'WRITE'
};

function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.entries(value as Record<string, unknown>)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${JSON.stringify(k)}:${canonical(v)}`)
      .join(',')}}`;
  }
  return JSON.stringify(value);
}

export function approvalDigest(secret: string, tool: string, args: Record<string, unknown>): string {
  const clean = { ...args };
  delete clean.approvalToken;
  return crypto.createHmac('sha256', secret).update(`${tool}\n${canonical(clean)}`).digest('hex');
}

export function assertAllowed(config: Config, tool: string, args: Record<string, unknown>): void {
  const risk = TOOL_RISK[tool];
  if (!risk) throw new Error('Unknown tool');
  if (risk === 'READ') return;
  if (risk === 'HIGH_RISK' && !config.enableHighRisk) throw new Error('High-risk tools are disabled');
  if (risk === 'WRITE' && !config.requireWriteApproval) return;
  if (!config.approvalSecret) throw new Error('Approval secret is required for this action');
  const supplied = typeof args.approvalToken === 'string' ? args.approvalToken : '';
  const expected = approvalDigest(config.approvalSecret, tool, args);
  const a = Buffer.from(supplied, 'utf8');
  const b = Buffer.from(expected, 'utf8');
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error('Explicit approval required for this exact action');
}
