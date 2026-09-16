import type {Config} from './config.js';
export type Risk='READ'|'WRITE'|'HIGH_RISK'|'DESTRUCTIVE';
export function authorize(config:Config,risk:Risk,approval?:string){if(risk==='READ')return;if(!config.allowWrites)throw new Error('Write tools are disabled. Set FRESHBOOKS_ALLOW_WRITES=true explicitly.');if(risk==='HIGH_RISK'||risk==='DESTRUCTIVE'){if(!config.approvalToken||approval!==config.approvalToken)throw new Error('Explicit human approval is required for this action.');}}
export function assertId(value:string,name:string){if(!/^[A-Za-z0-9_-]{1,128}$/.test(value))throw new Error(`Invalid ${name}`);return value;}
export function assertText(value:string,name:string,max=10000){const v=value.trim();if(!v||v.length>max)throw new Error(`Invalid ${name}`);return v;}
