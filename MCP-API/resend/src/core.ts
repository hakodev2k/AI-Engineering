import { z } from 'zod';

export type Risk='READ'|'WRITE'|'HIGH_RISK'|'DESTRUCTIVE';
export class ConnectorError extends Error { constructor(public code:string,message:string,public status?:number,public retryAfter?:number){super(message)} }
export interface Policy { requireWriteApproval:boolean; allowDestructive:boolean }
export const policy:Policy={requireWriteApproval:process.env.RESEND_REQUIRE_WRITE_APPROVAL!=='false',allowDestructive:process.env.RESEND_ALLOW_DESTRUCTIVE==='true'};
export function authorize(risk:Risk, approved=false){ if(risk==='DESTRUCTIVE'&&!policy.allowDestructive) throw new ConnectorError('DESTRUCTIVE_DISABLED','Destructive tools are disabled'); if((risk==='HIGH_RISK'||(risk==='WRITE'&&policy.requireWriteApproval))&&!approved) throw new ConnectorError('APPROVAL_REQUIRED','Explicit human approval is required'); }
export const id=z.string().min(1).max(256).regex(/^[A-Za-z0-9_\-.]+$/);
export const email=z.string().email().max(320);
export const pagination=z.object({limit:z.number().int().min(1).max(100).default(20),after:z.string().max(512).optional(),before:z.string().max(512).optional()});
export function untrusted<T>(data:T){return {data,trust:'untrusted-provider-content' as const};}
