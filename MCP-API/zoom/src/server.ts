import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { loadConfig } from './config.js';
import { ZoomRestClient } from './rest.js';
import { assertApproval } from './policy.js';

const config = loadConfig();
const client = new ZoomRestClient(config);
const server = new McpServer({ name: 'zoom-mcp-connector', version: '1.0.0' });
const out = (value: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(value) }] });
const enc = encodeURIComponent;
const userId = z.string().min(1).max(320).default('me');
const meetingId = z.union([z.string().min(1).max(200), z.number().int().positive()]).transform(String);
const meetingUuid = z.string().min(1).max(500);
const approvalId = z.string().length(64).optional();
const pageSize = z.number().int().min(1).max(300).optional();
const token = z.string().max(2000).optional();

server.tool('zoom.user.get', 'Get a Zoom user profile. READ.', { userId }, async a => out(await client.get(`/users/${enc(a.userId)}`)));

server.tool('zoom.meeting.list', 'List scheduled meetings for a user. READ.', {
  userId,
  type: z.enum(['scheduled','live','upcoming','upcoming_meetings','previous_meetings']).optional(),
  pageSize: z.number().int().min(1).max(300).optional(),
  nextPageToken: token
}, async a => out(await client.get(`/users/${enc(a.userId)}/meetings`, { type: a.type, page_size: a.pageSize, next_page_token: a.nextPageToken })));

server.tool('zoom.meeting.get', 'Get one meeting by ID. READ.', { meetingId }, async a => out(await client.get(`/meetings/${enc(a.meetingId)}`)));

server.tool('zoom.meeting.create', 'Create a scheduled Zoom meeting. WRITE; explicit approval required.', {
  userId,
  topic: z.string().min(1).max(200),
  startTime: z.string().datetime({ offset: true }),
  durationMinutes: z.number().int().min(1).max(1440),
  timezone: z.string().min(1).max(100).optional(),
  agenda: z.string().max(2000).optional(),
  password: z.string().min(1).max(10).regex(/^[A-Za-z0-9@_*-]+$/).optional(),
  approvalId
}, async a => {
  const payload = { topic: a.topic, type: 2, start_time: a.startTime, duration: a.durationMinutes, timezone: a.timezone, agenda: a.agenda, password: a.password };
  assertApproval(config, 'zoom.meeting.create', { userId: a.userId, ...payload }, a.approvalId);
  return out(await client.post(`/users/${enc(a.userId)}/meetings`, payload));
});

server.tool('zoom.meeting.update', 'Update meeting schedule or metadata. WRITE; explicit approval required.', {
  meetingId,
  topic: z.string().min(1).max(200).optional(),
  startTime: z.string().datetime({ offset: true }).optional(),
  durationMinutes: z.number().int().min(1).max(1440).optional(),
  timezone: z.string().min(1).max(100).optional(),
  agenda: z.string().max(2000).optional(),
  approvalId
}, async a => {
  const payload: Record<string,unknown> = {};
  if (a.topic !== undefined) payload.topic = a.topic;
  if (a.startTime !== undefined) payload.start_time = a.startTime;
  if (a.durationMinutes !== undefined) payload.duration = a.durationMinutes;
  if (a.timezone !== undefined) payload.timezone = a.timezone;
  if (a.agenda !== undefined) payload.agenda = a.agenda;
  if (!Object.keys(payload).length) throw new Error('At least one update field is required');
  assertApproval(config, 'zoom.meeting.update', { meetingId: a.meetingId, ...payload }, a.approvalId);
  return out(await client.patch(`/meetings/${enc(a.meetingId)}`, payload));
});

server.tool('zoom.meeting.delete', 'Delete a scheduled meeting. DESTRUCTIVE; explicit approval required.', {
  meetingId,
  occurrenceId: z.string().max(200).optional(),
  scheduleForReminder: z.boolean().optional(),
  cancelMeetingReminder: z.boolean().optional(),
  approvalId
}, async a => {
  const canonical = { meetingId: a.meetingId, occurrenceId: a.occurrenceId, scheduleForReminder: a.scheduleForReminder, cancelMeetingReminder: a.cancelMeetingReminder };
  assertApproval(config, 'zoom.meeting.delete', canonical, a.approvalId);
  return out(await client.del(`/meetings/${enc(a.meetingId)}`, { occurrence_id: a.occurrenceId, schedule_for_reminder: a.scheduleForReminder, cancel_meeting_reminder: a.cancelMeetingReminder }));
});

server.tool('zoom.recording.list', 'List cloud recordings for a user and date range. READ.', {
  userId,
  from: z.string().date(),
  to: z.string().date(),
  pageSize,
  nextPageToken: token,
  trash: z.boolean().optional()
}, async a => out(await client.get(`/users/${enc(a.userId)}/recordings`, { from: a.from, to: a.to, page_size: a.pageSize, next_page_token: a.nextPageToken, trash: a.trash })));

server.tool('zoom.recording.get', 'Get cloud recording files for a meeting. READ.', { meetingId }, async a => out(await client.get(`/meetings/${enc(a.meetingId)}/recordings`)));

server.tool('zoom.transcript.get', 'Get transcript metadata and download URL for a recorded meeting. READ.', { meetingId }, async a => out(await client.get(`/meetings/${enc(a.meetingId)}/transcript`)));

server.tool('zoom.participant.list', 'List participants from a past meeting instance. READ.', {
  meetingUuid,
  pageSize,
  nextPageToken: token
}, async a => out(await client.get(`/past_meetings/${enc(a.meetingUuid)}/participants`, { page_size: a.pageSize, next_page_token: a.nextPageToken })));

const shutdown = () => { void server.close().finally(() => process.exit(0)); };
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
await server.connect(new StdioServerTransport());
