import crypto from 'node:crypto';
import type { SquarespaceConfig } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK';

export const TOOL_RISK: Record<string, Risk> = {
  'squarespace.order.list': 'READ',
  'squarespace.order.get': 'READ',
  'squarespace.order.fulfill': 'HIGH_RISK',
  'squarespace.transaction.list': 'READ',
  'squarespace.transaction.get': 'READ',
  'squarespace.inventory.list': 'READ',
  'squarespace.inventory.adjust': 'HIGH_RISK',
  'squarespace.product.list': 'READ',
  'squarespace.product.get': 'READ',
  'squarespace.product.update': 'WRITE',
  'squarespace.contact.list': 'READ',
  'squarespace.contact.get': 'READ',
  'squarespace.contact.query': 'READ',
  'squarespace.contact.update': 'WRITE'
};

function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.entries(value as Record<string, unknown>)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${JSON.stringify(k)}:${canonical(v)}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

export function approvalDigest(secret: string, tool: string, args: Record<string, unknown>): string {
  const { approvalToken: _ignored, ...payload } = args;
  return crypto.createHmac('sha256', secret).update(`${tool}\n${canonical(payload)}`).digest('hex');
}

export function enforcePolicy(config: SquarespaceConfig, tool: string, args: Record<string, unknown>): void {
  const risk = TOOL_RISK[tool];
  if (!risk) throw new Error('Unknown or unapproved tool');
  if (risk === 'READ') return;
  if (risk === 'HIGH_RISK' && !config.enableHighRisk) throw new Error('HIGH_RISK operations are disabled');
  if (risk === 'WRITE' && !config.requireWriteApproval) return;
  if (!config.approvalSecret) throw new Error('Approval is required but SQUARESPACE_APPROVAL_SECRET is not configured');
  const supplied = typeof args.approvalToken === 'string' ? args.approvalToken : '';
  const expected = approvalDigest(config.approvalSecret, tool, args);
  if (!/^[0-9a-f]{64}$/.test(supplied)) throw new Error('Explicit approval token required');
  const a = Buffer.from(supplied, 'hex');
  const b = Buffer.from(expected, 'hex');
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error('Approval token does not match this exact operation');
}
