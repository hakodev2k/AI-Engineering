import { z } from 'zod';
export const id=z.number().int().positive();
export const listInput=z.object({page:z.number().int().min(1).default(1),per_page:z.number().int().min(1).max(50).default(50),label_selector:z.string().max(1024).optional()}).strict();
export const getServerInput=z.object({server_id:id}).strict();
export const createServerInput=z.object({name:z.string().min(1).max(64).regex(/^[A-Za-z0-9][A-Za-z0-9._-]*$/),server_type:z.string().min(1).max(64),image:z.union([z.string().min(1).max(128),id]),location:z.string().min(1).max(64).optional(),datacenter:z.string().min(1).max(64).optional(),ssh_keys:z.array(z.union([z.string().min(1).max(128),id])).max(20).optional(),labels:z.record(z.string().max(63),z.string().max(63)).optional(),user_data:z.string().max(32768).optional(),start_after_create:z.boolean().default(true),approval:z.literal(true)}).strict().refine(v=>!(v.location&&v.datacenter),{message:'location and datacenter are mutually exclusive'});
export const powerInput=z.object({server_id:id,action:z.enum(['poweron','poweroff','reboot','shutdown']),approval:z.literal(true)}).strict();
export const deleteServerInput=z.object({server_id:id,approval:z.literal(true),confirm:z.string().regex(/^DELETE SERVER [1-9][0-9]*$/)}).strict().refine(v=>v.confirm===`DELETE SERVER ${v.server_id}`,{message:'confirm must exactly match server id'});
