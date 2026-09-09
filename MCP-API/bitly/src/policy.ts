export type Risk='READ'|'WRITE'|'HIGH_RISK'|'DESTRUCTIVE';
export type Policy={requireWriteApproval:boolean;destructiveEnabled:boolean};
export function authorize(risk:Risk,approved:boolean|undefined,policy:Policy){
  if(risk==='READ')return;
  if(risk==='DESTRUCTIVE'&&!policy.destructiveEnabled)throw new Error('Destructive operations are disabled by configuration');
  if(risk==='HIGH_RISK'||risk==='DESTRUCTIVE'||(risk==='WRITE'&&policy.requireWriteApproval)){
    if(approved!==true)throw new Error(`Explicit human approval is required for ${risk} operation`);
  }
}
