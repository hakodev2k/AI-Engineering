import { createHmac, timingSafeEqual } from 'node:crypto';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export const TOOL_RISK: Record<string, Risk> = {
  'qase.project.context': 'READ',
  'qase.entity.get': 'READ',
  'qase.qql.search': 'READ',
  'qase.qql.help': 'READ',
  'qase.case.save': 'WRITE',
  'qase.defect.save': 'WRITE',
  'qase.run.save': 'WRITE',
  'qase.result.record': 'WRITE',
  'qase.ci.report': 'WRITE',
  'qase.regression.run.create': 'WRITE'
};

export function approvalFor(tool: string, payload: unknown, secret: string): string {
  return createHmac('sha256', secret).update(`${tool}\n${stableJson(payload)}`).digest('hex');
}

export function assertApproval(tool: string, payload: unknown, approvalId: string | undefined, secret: string): void {
  if (TOOL_RISK[tool] === 'READ') return;
  if (!approvalId || !/^[a-f0-9]{64}$/i.test(approvalId)) throw new Error(`${tool} requires explicit human approval`);
  const expected = approvalFor(tool, payload, secret);
  const a = Buffer.from(approvalId.toLowerCase(), 'hex');
  const b = Buffer.from(expected, 'hex');
  if (a.length !== b.length || !timingSafeEqual(a, b)) throw new Error(`Invalid approval for ${tool}`);
}

function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(',')}]`;
  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b));
    return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${stableJson(v)}`).join(',')}}`;
  }
  return JSON.stringify(value);
}
