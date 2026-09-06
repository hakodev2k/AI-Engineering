import { createHmac, timingSafeEqual } from 'node:crypto';
import type { AttioConfig, Permission } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'DESTRUCTIVE';

export function requiredPermission(risk: Risk): Permission {
  return risk === 'READ' ? 'read' : risk === 'WRITE' ? 'write' : 'destructive';
}

export function canonicalize(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(',')}]`;
  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    return `{${Object.keys(obj).sort().map(k => `${JSON.stringify(k)}:${canonicalize(obj[k])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

export function expectedApproval(tool: string, args: Record<string, unknown>, secret: string): string {
  const clean = { ...args };
  delete clean.approvalId;
  return createHmac('sha256', secret).update(`${tool}\n${canonicalize(clean)}`).digest('hex');
}

export function assertAllowed(risk: Risk, tool: string, args: Record<string, unknown>, config: AttioConfig): void {
  const permission = requiredPermission(risk);
  if (!config.permissions.has(permission)) throw new Error(`${tool} requires ${permission.toUpperCase()} permission.`);
  if (risk === 'READ') return;
  if (risk === 'DESTRUCTIVE') {
    if (!config.approvalSecret) throw new Error(`${tool} is destructive and requires ATTIO_APPROVAL_SECRET plus explicit approval.`);
  } else if (!config.requireWriteApproval) return;
  if (!config.approvalSecret) throw new Error(`${tool} requires explicit approval but ATTIO_APPROVAL_SECRET is not configured.`);
  const provided = typeof args.approvalId === 'string' ? args.approvalId : '';
  const expected = expectedApproval(tool, args, config.approvalSecret);
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) throw new Error(`Explicit human approval is required for ${tool}.`);
}
