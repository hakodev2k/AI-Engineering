import { z } from 'zod';

export type Risk='READ'|'WRITE'|'HIGH_RISK'|'DESTRUCTIVE';
export type Policy={writeApproval:boolean; destructiveEnabled:boolean};
export const Id=z.union([z.string().regex(/^\d{1,20}$/),z.number().int().positive()]).transform(String);
export const Page=z.object({cursor:z.string().max(500).optional(),limit:z.number().int().min(1).max(100).default(50)}).strict();
export const Approved=z.object({approved:z.literal(true)}).strict();
export function authorize(risk:Risk, approved:boolean|undefined, p:Policy){
  if(risk==='READ') return;
  if(risk==='WRITE' && !p.writeApproval) return;
  if(risk==='DESTRUCTIVE' && !p.destructiveEnabled) throw new Error('DESTRUCTIVE_DISABLED');
  if(!approved) throw new Error('APPROVAL_REQUIRED');
}
export const safeText=(n:number)=>z.string().trim().min(1).max(n);
export const targetUrl=z.string().url().refine(v=>/^https?:\/\//.test(v),'Only HTTP(S) monitor targets are accepted');
