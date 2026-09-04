import {z} from 'zod'; import type {Risk} from './core.js';
const approval=z.object({confirmed:z.literal(true),reason:z.string().min(3).max(500)});
const id=z.string().min(3).max(512);
export type Def={name:string;risk:Risk;transport:'mcp'|'rest';upstream?:string;schema:z.ZodTypeAny};
export const defs:Def[]=[
{name:'google-drive.file.search',risk:'READ',transport:'mcp',upstream:'search_files',schema:z.object({query:z.string().min(1).max(2000),pageToken:z.string().optional(),pageSize:z.number().int().min(1).max(100).optional(),excludeContentSnippets:z.boolean().optional()}).strict()},
{name:'google-drive.file.recent.list',risk:'READ',transport:'mcp',upstream:'list_recent_files',schema:z.object({pageToken:z.string().optional(),pageSize:z.number().int().min(1).max(100).optional()}).strict()},
{name:'google-drive.file.metadata.get',risk:'READ',transport:'mcp',upstream:'get_file_metadata',schema:z.object({fileId:id}).strict()},
{name:'google-drive.file.content.read',risk:'READ',transport:'mcp',upstream:'read_file_content',schema:z.object({fileId:id,includeComments:z.boolean().optional()}).strict()},
{name:'google-drive.file.content.download',risk:'READ',transport:'mcp',upstream:'download_file_content',schema:z.object({fileId:id}).strict()},
{name:'google-drive.file.permissions.list',risk:'READ',transport:'mcp',upstream:'get_file_permissions',schema:z.object({fileId:id}).strict()},
{name:'google-drive.file.create',risk:'WRITE',transport:'mcp',upstream:'create_file',schema:z.object({title:z.string().min(1).max(32768),contentMimeType:z.string().max(255).optional(),base64Content:z.string().max(20_000_000).optional(),textContent:z.string().max(5_000_000).optional(),parentId:id.optional(),disableConversionToGoogleType:z.boolean().optional(),approval}).strict().refine(v=>!(v.base64Content&&v.textContent),'Choose base64Content or textContent, not both.')},
{name:'google-drive.file.copy',risk:'WRITE',transport:'mcp',upstream:'copy_file',schema:z.object({fileId:id,title:z.string().min(1).max(32768).optional(),parentId:id.optional(),approval}).strict()},
{name:'google-drive.file.update',risk:'WRITE',transport:'rest',schema:z.object({fileId:id,name:z.string().min(1).max(32768).optional(),description:z.string().max(32768).optional(),starred:z.boolean().optional(),addParentId:id.optional(),removeParentId:id.optional(),approval}).strict().refine(v=>v.name!==undefined||v.description!==undefined||v.starred!==undefined||v.addParentId!==undefined||v.removeParentId!==undefined,'At least one update is required.')},
{name:'google-drive.permission.create',risk:'HIGH_RISK',transport:'rest',schema:z.object({fileId:id,type:z.enum(['user','group','domain','anyone']),role:z.enum(['reader','commenter','writer']),emailAddress:z.string().email().optional(),domain:z.string().min(3).max(253).optional(),sendNotificationEmail:z.boolean().optional(),emailMessage:z.string().max(1000).optional(),approval}).strict().superRefine((v,ctx)=>{if(['user','group'].includes(v.type)&&!v.emailAddress)ctx.addIssue({code:'custom',message:'emailAddress required for user/group'});if(v.type==='domain'&&!v.domain)ctx.addIssue({code:'custom',message:'domain required for domain permission'});})},
{name:'google-drive.shared_drive.list',risk:'READ',transport:'rest',schema:z.object({pageSize:z.number().int().min(1).max(100).optional(),pageToken:z.string().optional(),q:z.string().max(1000).optional()}).strict()}
];
export const byName=new Map(defs.map(d=>[d.name,d]));
