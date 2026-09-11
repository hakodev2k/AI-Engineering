import type {Config} from './config.js';
export type Risk='READ'|'WRITE'|'HIGH_RISK'|'DESTRUCTIVE';
export function authorize(c:Config,risk:Risk,approved=false){
 if(risk==='READ') return;
 if(risk==='DESTRUCTIVE'){if(!c.enableDestructive||!approved) throw new Error('Destructive operation disabled or missing explicit approval');return;}
 if(!c.approveWrites&&!approved) throw new Error(`${risk} operation requires explicit approval`);
}
