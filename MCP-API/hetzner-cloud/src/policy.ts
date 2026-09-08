import { config } from './config.js';
export type Risk='READ'|'WRITE'|'HIGH_RISK'|'DESTRUCTIVE';
export function requirePermission(risk:Risk,approved=false){
  if(risk==='READ')return;
  if(risk==='WRITE')throw new Error('No WRITE-class tools are enabled by this connector');
  if(risk==='HIGH_RISK'&&(!config.allowHighRisk||!approved))throw new Error('HIGH_RISK operation requires enablement and explicit approval');
  if(risk==='DESTRUCTIVE'&&(!config.allowDestructive||!approved))throw new Error('DESTRUCTIVE operation requires enablement and explicit approval');
}
