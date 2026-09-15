import { z } from 'zod';

export type Risk='READ'|'WRITE'|'HIGH_RISK'|'DESTRUCTIVE';
export class ApprovalError extends Error {}
export class TelnyxError extends Error { constructor(message:string, public status?:number, public retryAfter?:number){super(message)} }

export const e164=z.string().regex(/^\+[1-9]\d{7,14}$/,'must be E.164');
export const id=z.string().min(1).max(128).regex(/^[A-Za-z0-9_-]+$/);
export const page=z.object({page:z.number().int().min(1).max(10000).default(1),pageSize:z.number().int().min(1).max(100).default(20)});

export function requireApproval(risk:Risk, approved:boolean|undefined){
  const writeRequired=(process.env.TELNYX_WRITE_APPROVAL_REQUIRED??'true')!=='false';
  if(risk==='DESTRUCTIVE' && process.env.TELNYX_DESTRUCTIVE_ENABLED!=='true') throw new ApprovalError('Destructive operations are disabled');
  if((risk==='HIGH_RISK'||risk==='DESTRUCTIVE'||(risk==='WRITE'&&writeRequired))&&!approved) throw new ApprovalError('Explicit human approval required');
}
