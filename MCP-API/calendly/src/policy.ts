import crypto from 'node:crypto';
import type { CalendlyConfig } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export const TOOL_POLICY: Record<string, { risk: Risk; approval: boolean }> = {
  'calendly.user.get_current': { risk: 'READ', approval: false },
  'calendly.event_type.list': { risk: 'READ', approval: false },
  'calendly.event_type.get': { risk: 'READ', approval: false },
  'calendly.availability.list_times': { risk: 'READ', approval: false },
  'calendly.availability.list_busy_times': { risk: 'READ', approval: false },
  'calendly.event.list': { risk: 'READ', approval: false },
  'calendly.event.get': { risk: 'READ', approval: false },
  'calendly.invitee.list': { risk: 'READ', approval: false },
  'calendly.booking.create': { risk: 'WRITE', approval: true },
  'calendly.event.cancel': { risk: 'DESTRUCTIVE', approval: true },
  'calendly.scheduling_link.create_single_use': { risk: 'WRITE', approval: true },
  'calendly.event_type.create': { risk: 'WRITE', approval: true },
  'calendly.event_type.update': { risk: 'WRITE', approval: true }
};

export function approvalToken(secret: string, tool: string, args: unknown): string {
  return crypto.createHmac('sha256', secret).update(`${tool}\n${stableStringify(args)}`).digest('hex');
}

export function assertApproved(config: CalendlyConfig, tool: string, args: unknown, provided?: string) {
  const policy = TOOL_POLICY[tool];
  if (!policy) throw new Error(`Unknown tool policy: ${tool}`);
  if (!policy.approval || !config.CALENDLY_REQUIRE_WRITE_APPROVAL) return;
  const secret = config.CALENDLY_APPROVAL_SECRET;
  if (!secret || !provided) throw new Error(`${tool} requires explicit human approval`);
  const expected = Buffer.from(approvalToken(secret, tool, args));
  const actual = Buffer.from(provided);
  if (expected.length !== actual.length || !crypto.timingSafeEqual(expected, actual)) {
    throw new Error(`Invalid approval token for ${tool}`);
  }
}

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => `${JSON.stringify(k)}:${stableStringify(v)}`).join(',')}}`;
  }
  return JSON.stringify(value);
}
