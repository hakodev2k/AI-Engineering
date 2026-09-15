import {z} from 'zod';
export type Risk='READ'|'WRITE'|'HIGH_RISK'|'DESTRUCTIVE';
export class ConnectorError extends Error{constructor(public code:string,message:string,public status?:number,public retryAfter?:number){super(message)}}
export const requireWrite=process.env.PLIVO_REQUIRE_WRITE_APPROVAL!=='false';
export function authorize(risk:Risk,approved=false){if((risk==='HIGH_RISK'||risk==='DESTRUCTIVE'||(risk==='WRITE'&&requireWrite))&&!approved)throw new ConnectorError('APPROVAL_REQUIRED','Explicit human approval required')}
export const uuid=z.string().uuid(); export const e164=z.string().regex(/^\+[1-9]\d{7,14}$/); export const page=z.object({limit:z.number().int().min(1).max(20).default(20),offset:z.number().int().min(0).max(100000).default(0)});
export function untrusted<T>(data:T){return {data,trust:'untrusted-provider-content' as const}}
