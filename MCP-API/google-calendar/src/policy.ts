import { createHmac, timingSafeEqual } from 'node:crypto';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export function approvalDigest(secret: string, action: string, resource: string) {
  return createHmac('sha256', secret).update(`${action}:${resource}`).digest('hex');
}

export function assertApproval(action: string, resource: string, token: string | undefined, secret: string | undefined) {
  if (!secret) throw new Error('Write actions are disabled: GOOGLE_CALENDAR_APPROVAL_SECRET is not configured');
  if (!token || !/^[a-f0-9]{64}$/i.test(token)) throw new Error(`Explicit approval is required for ${action}`);
  const expected = Buffer.from(approvalDigest(secret, action, resource), 'hex');
  const supplied = Buffer.from(token, 'hex');
  if (expected.length !== supplied.length || !timingSafeEqual(expected, supplied)) throw new Error(`Invalid approval for ${action}`);
}

export const TOOL_META = [
  ['google_calendar.calendar.list', 'READ'],
  ['google_calendar.event.search', 'READ'],
  ['google_calendar.event.list', 'READ'],
  ['google_calendar.event.get', 'READ'],
  ['google_calendar.event.instances', 'READ'],
  ['google_calendar.availability.suggest', 'READ'],
  ['google_calendar.event.create', 'WRITE'],
  ['google_calendar.event.update', 'WRITE'],
  ['google_calendar.event.respond', 'HIGH_RISK'],
  ['google_calendar.event.move', 'HIGH_RISK'],
  ['google_calendar.event.delete', 'DESTRUCTIVE']
] as const satisfies readonly (readonly [string, Risk])[];
