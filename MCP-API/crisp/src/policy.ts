export type Risk='READ'|'WRITE'|'HIGH_RISK'|'DESTRUCTIVE';
export function authorize(risk:Risk,approved:boolean|undefined,cfg:{requireWriteApproval:boolean;enableDestructive:boolean}){
  if(risk==='READ') return;
  if(risk==='DESTRUCTIVE'&&!cfg.enableDestructive) throw new Error('DESTRUCTIVE_DISABLED');
  if(risk==='HIGH_RISK'&&approved!==true) throw new Error('APPROVAL_REQUIRED');
  if(risk==='DESTRUCTIVE'&&approved!==true) throw new Error('APPROVAL_REQUIRED');
  if(risk==='WRITE'&&cfg.requireWriteApproval&&approved!==true) throw new Error('APPROVAL_REQUIRED');
}
