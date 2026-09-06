import { z } from 'zod';
import type { Risk } from './policy.js';

const id = z.string().min(1).max(200);
const slug = z.string().min(1).max(200).regex(/^[A-Za-z0-9_-]+$/);
const timestamp = z.string().min(1).max(64);
const approvalId = z.string().length(64).regex(/^[a-f0-9]{64}$/).optional();
const jsonObject = z.record(z.string().max(200), z.unknown()).refine(v => JSON.stringify(v).length <= 100_000, 'JSON object is too large');
const filterString = z.string().max(20_000);
const offset = z.number().int().min(0).max(10_000).optional();
const limit50 = z.number().int().min(1).max(50).optional();
const email = z.string().email().max(320);

export interface ToolDef {
  name: string;
  upstream: string;
  description: string;
  risk: Risk;
  schema: z.ZodObject<any>;
}

export const TOOLS: ToolDef[] = [
  { name:'attio.workspace.whoami', upstream:'whoami', risk:'READ', description:'Get the authenticated Attio user and workspace identity.', schema:z.object({}).strict() },
  { name:'attio.record.search', upstream:'search-records', risk:'READ', description:'Full-text search records in one Attio object.', schema:z.object({ object:slug, query:z.string().min(1).max(500), limit:limit50, offset }).strict() },
  { name:'attio.record.list', upstream:'list-records', risk:'READ', description:'List records for one object with bounded provider-native filter and sorts.', schema:z.object({ object:slug, filter:filterString.optional(), sorts:z.array(jsonObject).max(2).optional(), limit:limit50, offset }).strict() },
  { name:'attio.record.get_many', upstream:'get-records-by-ids', risk:'READ', description:'Get complete record details for explicit IDs.', schema:z.object({ object:slug, record_ids:z.array(id).min(1).max(50) }).strict() },
  { name:'attio.attribute.list', upstream:'list-attribute-definitions', risk:'READ', description:'List attribute definitions and valid options for an object.', schema:z.object({ object:slug, include_archived:z.boolean().optional(), query:z.string().max(500).optional(), limit:limit50, offset }).strict() },
  { name:'attio.record.create', upstream:'create-record', risk:'WRITE', description:'Create a CRM record. Inspect attributes first and use an upsert when a stable matching attribute is available.', schema:z.object({ object:slug, values:jsonObject, approvalId }).strict() },
  { name:'attio.record.upsert', upstream:'upsert-record', risk:'WRITE', description:'Create or update a record using a matching attribute.', schema:z.object({ object:slug, matching_attribute:slug, values:jsonObject, patch_multiselect_values:z.boolean().optional(), approvalId }).strict() },
  { name:'attio.record.update', upstream:'update-record', risk:'WRITE', description:'Update one existing record by ID.', schema:z.object({ object:slug, record_id:id, values:jsonObject, patch_multiselect_values:z.boolean().optional(), approvalId }).strict() },
  { name:'attio.list.list', upstream:'list-lists', risk:'READ', description:'List Attio lists/pipelines.', schema:z.object({ query:z.string().max(500).optional(), limit:limit50, offset }).strict() },
  { name:'attio.list.entries', upstream:'list-records-in-list', risk:'READ', description:'List entries and parent records in a list.', schema:z.object({ list:slug, filter:filterString.optional(), sorts:z.array(jsonObject).max(2).optional(), limit:limit50, offset }).strict() },
  { name:'attio.list.add_record', upstream:'add-record-to-list', risk:'WRITE', description:'Add an existing record to a list.', schema:z.object({ list:slug, parent_object:slug, parent_record_id:id, allow_duplicates:z.boolean().optional(), entry_values:jsonObject.optional(), approvalId }).strict() },
  { name:'attio.note.search', upstream:'search-notes-by-metadata', risk:'READ', description:'Search notes by parent record, author, meeting, or creation time.', schema:z.object({ parent_record_object:slug.optional(), parent_record_id:id.optional(), workspace_membership_id:id.optional(), meeting_id:id.optional(), created_at_gt:timestamp.optional(), created_at_lt:timestamp.optional(), limit:limit50, offset }).strict() },
  { name:'attio.note.get', upstream:'get-note-body', risk:'READ', description:'Retrieve the full content of a note.', schema:z.object({ note_id:id }).strict() },
  { name:'attio.note.create', upstream:'create-note', risk:'WRITE', description:'Create a Markdown note attached to a CRM record.', schema:z.object({ parent_object:slug, parent_record_id:id, title:z.string().min(1).max(500), content:z.string().min(1).max(100000), meeting_id:id.optional(), approvalId }).strict() },
  { name:'attio.task.list', upstream:'list-tasks', risk:'READ', description:'List tasks with bounded filters.', schema:z.object({ assignee_workspace_member_id:id.nullable().optional(), is_completed:z.boolean().optional(), linked_record_object:slug.optional(), linked_record_id:id.optional(), created_at_gte:timestamp.optional(), created_at_lte:timestamp.optional(), deadline_at_gte:timestamp.optional(), deadline_at_lte:timestamp.optional(), sort_by:z.string().max(100).optional(), sort_direction:z.enum(['asc','desc']).optional(), limit:limit50, offset }).strict() },
  { name:'attio.task.create', upstream:'create-task', risk:'WRITE', description:'Create a follow-up task.', schema:z.object({ content:z.string().min(1).max(5000), deadline_at:timestamp.optional(), assignee_workspace_member_id:id.optional(), is_completed:z.boolean().optional(), linked_record_object:slug.optional(), linked_record_id:id.optional(), approvalId }).strict() },
  { name:'attio.task.update', upstream:'update-task', risk:'WRITE', description:'Update task deadline, completion status, assignee, or linked record.', schema:z.object({ task_id:id, deadline_at:timestamp.nullable().optional(), assignee_workspace_member_id:id.optional(), is_completed:z.boolean().optional(), linked_record_object:slug.optional(), linked_record_id:id.optional(), approvalId }).strict() },
  { name:'attio.meeting.search', upstream:'search-meetings', risk:'READ', description:'Search past/upcoming meetings by participants, related records, and time range.', schema:z.object({ starts_after:timestamp, starts_before:timestamp, timezone:z.string().min(1).max(100), participant_email_addresses:z.array(email).max(50).optional(), participant_email_addresses_operator:z.enum(['AND','OR']).optional(), related_record_object:slug.optional(), related_record_ids:z.array(id).max(50).optional(), related_records_operator:z.enum(['AND','OR']).optional(), limit:limit50, offset }).strict() },
  { name:'attio.email.search', upstream:'search-emails-by-metadata', risk:'READ', description:'Search email metadata by participants, domain, or sent time range.', schema:z.object({ domain:z.string().max(253).optional(), participant_email_addresses:z.array(email).max(50).optional(), sent_at_gt:timestamp.optional(), sent_at_lt:timestamp.optional(), limit:limit50, offset }).strict() },
  { name:'attio.email.get', upstream:'get-email-content', risk:'READ', description:'Retrieve the body of one email the authenticated Attio user may access.', schema:z.object({ mailbox_id:id, email_id:id }).strict() },
  { name:'attio.report.run', upstream:'run-basic-report', risk:'READ', description:'Run an aggregate report over an Attio object or list.', schema:z.object({ source:slug, metric:jsonObject, filter:filterString.optional(), group_by:z.array(jsonObject).max(2).optional() }).strict() }
];

export const TOOL_MAP = new Map(TOOLS.map(t => [t.name, t]));
