import { z } from 'zod';

export type Risk='READ'|'WRITE'|'HIGH_RISK'|'DESTRUCTIVE';
export class ConnectorError extends Error { constructor(public code:string,message:string,public retryAfter?:number){super(message)} }
export class ApprovalGate {
  constructor(private secret=process.env.SLACK_APPROVAL_SECRET||''){}
  require(risk:Risk, approval?:string){
    if(risk==='READ') return;
    if(!this.secret) throw new ConnectorError('APPROVAL_NOT_CONFIGURED','Write operations require SLACK_APPROVAL_SECRET.');
    if(!approval || approval!==this.secret) throw new ConnectorError('APPROVAL_REQUIRED',`Explicit approval is required for ${risk} operation.`);
  }
}
export const channelId=z.string().regex(/^[A-Z0-9]{2,32}$/);
export const timestamp=z.string().regex(/^\d{10,}\.\d{6}$/);
export const text=z.string().min(1).max(40000);
export const limit=z.number().int().min(1).max(200).default(100);
