import type { Config } from './config.js';
export type Risk='READ'|'WRITE'|'HIGH_RISK'|'DESTRUCTIVE';
export class ApprovalError extends Error{}
export function authorize(config:Config,risk:Risk,approved=false){
 if(risk==='READ') return;
 if(!config.allowWrite) throw new ApprovalError('Write tools are disabled by configuration');
 if(!approved) throw new ApprovalError('Explicit human approval is required');
 if(risk==='DESTRUCTIVE'&&!config.allowDestructive) throw new ApprovalError('Destructive tools are disabled by configuration');
}
