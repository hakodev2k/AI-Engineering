import {z} from 'zod'; import {authorize,policies} from './policy.js'; import type {Upstream} from './upstream.js';
const id=z.string().min(1).max(256); const approval=z.boolean().optional().default(false);
export const schemas={
 'loom.recording.search':z.object({query:z.string().min(1).max(500),limit:z.number().int().min(1).max(50).default(20)}),
 'loom.recording.get':z.object({recordingId:id}), 'loom.transcript.get':z.object({recordingId:id}), 'loom.comment.list':z.object({recordingId:id}), 'loom.ai_brief.get':z.object({recordingId:id}), 'loom.action_item.list':z.object({recordingId:id}),
 'loom.recording.update':z.object({recordingId:id,title:z.string().min(1).max(500).optional(),description:z.string().max(5000).optional(),approved:approval}).refine(x=>x.title!==undefined||x.description!==undefined,'At least one update is required'),
 'loom.recording.move':z.object({recordingId:id,folderId:id,approved:approval}), 'loom.comment.create':z.object({recordingId:id,text:z.string().min(1).max(5000),approved:approval})};
export type ToolName=keyof typeof schemas;
export async function execute(upstream:Upstream,name:ToolName,input:unknown){const parsed=schemas[name].parse(input) as Record<string,unknown>;const approved=parsed.approved===true;delete parsed.approved;const policy=authorize(name,approved);return upstream.call(policy,parsed);}
export const toolNames=Object.keys(policies);
