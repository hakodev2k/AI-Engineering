import crypto from 'node:crypto';
import { approvalDigest, type Config } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';
export const TOOL_POLICY: Record<string,{risk:Risk;approval:boolean}> = {
  'zoom.user.get': {risk:'READ',approval:false},
  'zoom.meeting.list': {risk:'READ',approval:false},
  'zoom.meeting.get': {risk:'READ',approval:false},
  'zoom.meeting.create': {risk:'WRITE',approval:true},
  'zoom.meeting.update': {risk:'WRITE',approval:true},
  'zoom.meeting.delete': {risk:'DESTRUCTIVE',approval:true},
  'zoom.recording.list': {risk:'READ',approval:false},
  'zoom.recording.get': {risk:'READ',approval:false},
  'zoom.transcript.get': {risk:'READ',approval:false},
  'zoom.participant.list': {risk:'READ',approval:false}
};

export function assertApproval(config: Config, tool: string, payload: unknown, approvalId?: string) {
  const p = TOOL_POLICY[tool];
  if (!p?.approval) return;
  if (!config.approvalSecret) throw new Error(`${tool} requires ZOOM_APPROVAL_SECRET`);
  if (!approvalId) throw new Error(`${tool} requires explicit approval`);
  const expected = approvalDigest(config.approvalSecret, tool, payload);
  const a = Buffer.from(approvalId), b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a,b)) throw new Error(`Invalid approval for ${tool}`);
}
