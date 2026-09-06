import { z } from 'zod';
import type { Risk } from './policy.js';

const id = z.string().min(1).max(200);
const slug = z.string().min(1).max(200).regex(/^[A-Za-z0-9_-]+$/);
const approvalId = z.string().length(64).optional();
const jsonObject = z.record(z.string().max(200), z.unknown()).refine(v => JSON.stringify(v).length <= 100_000, 'JSON object is too large');

export interface ToolDef {
  name: string;
  upstream: string;
  description: string;
  risk: Risk;
  schema: z.ZodObject<any>;
}

export const TOOLS: ToolDef[] = [
  { name:'attio.workspace.whoami', upstream:'whoami', risk:'READ', description:'Get the authenticated Attio user and workspace identity.', schema:z.object({}).strict() },
  { name:'attio.object.list', upstream:'list-objects', risk:'READ', description:'List or fuzzy-search CRM object definitions.', schema:z.object({ query:z.string().max(500).optional() }).strict() },
  { name:'attio.record.search', upstream:'search-records', risk:'READ', description:'Full-text search Attio records.', schema:z.object({ query:z.string().min(1).max(1000), object:z.string().max(200).optional() }).strict() },
  { name:'attio.record.list', upstream:'list-records', risk:'READ', description:'List records for one object with bounded provider-native filters and sorts.', schema:z.object({ object:slug, filter:jsonObject.optional(), sorts:z.array(jsonObject).max(10).optional(), limit:z.number().int().min(1).max(100).optional() }).strict() },
  { name:'attio.record.get_many', upstream:'get-records-by-ids', risk:'READ', description:'Get complete record details for explicit IDs.', schema:z.object({ object:slug, record_ids:z.array(id).min(1).max(50) }).strict() },
  { name:'attio.attribute.list', upstream:'list-attribute-definitions', risk:'READ', description:'List attribute definitions and valid options for an object.', schema:z.object({ object:slug }).strict() },
  { name:'attio.record.create', upstream:'create-record', risk:'WRITE', description:'Create a CRM record. Use a unique email/domain where applicable to reduce duplicates.', schema:z.object({ object:slug, values:jsonObject, approvalId }).strict() },
  { name:'attio.record.upsert', upstream:'upsert-record', risk:'WRITE', description:'Create or update a record using a matching attribute.', schema:z.object({ object:slug, matching_attribute:slug, values:jsonObject, approvalId }).strict() },
  { name:'attio.record.update', upstream:'update-record', risk:'WRITE', description:'Update one existing record by ID.', schema:z.object({ object:slug, record_id:id, values:jsonObject, approvalId }).strict() },
  { name:'attio.list.list', upstream:'list-lists', risk:'READ', description:'List Attio lists/pipelines.', schema:z.object({ query:z.string().max(500).optional() }).strict() },
  { name:'attio.list.entries', upstream:'list-records-in-list', risk:'READ', description:'List entries and parent records in a list.', schema:z.object({ list:slug, filter:jsonObject.optional(), sorts:z.array(jsonObject).max(10).optional(), limit:z.number().int().min(1).max(100).optional() }).strict() },
  { name:'attio.list.add_record', upstream:'add-record-to-list', risk:'WRITE', description:'Add an existing record to a list.', schema:z.object({ list:slug, record_id:id, values:jsonObject.optional(), approvalId }).strict() },
  { name:'attio.note.search', upstream:'search-notes-by-metadata', risk:'READ', description:'Search notes by metadata such as parent record, author, meeting, or creation time.', schema:z.object({ parent_record_id:id.optional(), author_id:id.optional(), created_after:z.string().max(64).optional(), created_before:z.string().max(64).optional(), limit:z.number().int().min(1).max(100).optional() }).strict() },
  { name:'attio.note.get', upstream:'get-note-body', risk:'READ', description:'Retrieve the full content of a note.', schema:z.object({ note_id:id }).strict() },
  { name:'attio.note.create', upstream:'create-note', risk:'WRITE', description:'Create a note attached to a CRM record.', schema:z.object({ parent_record_id:id, title:z.string().min(1).max(500), content:z.string().min(1).max(100000), approvalId }).strict() },
  { name:'attio.task.list', upstream:'list-tasks', risk:'READ', description:'List tasks with bounded filters.', schema:z.object({ status:z.string().max(100).optional(), assignee_id:id.optional(), linked_record_id:id.optional(), deadline_after:z.string().max(64).optional(), deadline_before:z.string().max(64).optional(), limit:z.number().int().min(1).max(100).optional() }).strict() },
  { name:'attio.task.create', upstream:'create-task', risk:'WRITE', description:'Create a follow-up task.', schema:z.object({ content:z.string().min(1).max(5000), deadline:z.string().max(64).optional(), assignee_id:id.optional(), linked_record_id:id.optional(), approvalId }).strict() },
  { name:'attio.task.update', upstream:'update-task', risk:'WRITE', description:'Update task status, deadline, assignee, or linked record.', schema:z.object({ task_id:id, status:z.string().max(100).optional(), deadline:z.string().max(64).nullable().optional(), assignee_id:id.nullable().optional(), linked_record_id:id.nullable().optional(), approvalId }).strict() },
  { name:'attio.meeting.search', upstream:'search-meetings', risk:'READ', description:'Search past/upcoming meetings by participants, related records, or time range.', schema:z.object({ query:z.string().max(1000).optional(), start:z.string().max(64).optional(), end:z.string().max(64).optional(), limit:z.number().int().min(1).max(100).optional() }).strict() },
  { name:'attio.email.search', upstream:'search-emails-by-metadata', risk:'READ', description:'Search email metadata by participants/domain/time range.', schema:z.object({ participant:z.string().max(320).optional(), domain:z.string().max(253).optional(), start:z.string().max(64).optional(), end:z.string().max(64).optional(), limit:z.number().int().min(1).max(100).optional() }).strict() },
  { name:'attio.email.get', upstream:'get-email-content', risk:'READ', description:'Retrieve the body of one email the authenticated Attio user may access.', schema:z.object({ email_id:id }).strict() },
  { name:'attio.report.run', upstream:'run-basic-report', risk:'READ', description:'Run Attio aggregate reporting with a bounded provider-native report specification.', schema:z.object({ report:jsonObject }).strict() }
];

export const TOOL_MAP = new Map(TOOLS.map(t => [t.name, t]));
