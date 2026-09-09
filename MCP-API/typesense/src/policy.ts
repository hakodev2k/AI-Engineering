export type Risk='READ'|'WRITE'|'HIGH_RISK'|'DESTRUCTIVE';
export function authorize(risk:Risk,approved:boolean|undefined,cfg:{requireWriteApproval:boolean;destructiveEnabled:boolean}){
  if(risk==='READ') return;
  if(risk==='DESTRUCTIVE'&&!cfg.destructiveEnabled) throw new Error('Destructive tools are disabled. Set TYPESENSE_DESTRUCTIVE_ENABLED=true only under explicit policy.');
  if((risk==='HIGH_RISK'||risk==='DESTRUCTIVE'||(risk==='WRITE'&&cfg.requireWriteApproval))&&approved!==true) throw new Error(`Human approval required for ${risk} operation`);
}
