export type Risk='READ'|'WRITE'|'HIGH_RISK'|'DESTRUCTIVE';
export class ApprovalError extends Error { constructor(){super('Explicit human approval is required for this operation');this.name='ApprovalError';} }
export function requireApproval(risk:Risk, approved:boolean|undefined, requireWrites=true):void {
  if(risk==='DESTRUCTIVE') throw new ApprovalError();
  if((risk==='HIGH_RISK'||(risk==='WRITE'&&requireWrites))&&approved!==true) throw new ApprovalError();
}
export const untrusted=(data:unknown)=>({source:'honeycomb',trust:'untrusted-provider-data',data});
