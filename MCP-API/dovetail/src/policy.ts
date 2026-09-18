import type{Config,Risk}from'./config.js';
export function authorize(c:Config,risk:Risk,approved=false){if(risk==='READ')return;if(risk==='DESTRUCTIVE'){if(!c.destructiveEnabled)throw new Error('Destructive tools are disabled');if(!approved)throw new Error('Explicit human approval required');return}if(risk==='HIGH_RISK'||(risk==='WRITE'&&c.writeApproval==='required'))if(!approved)throw new Error('Human approval required')}
export function resourceId(v:string){if(!/^[0-9A-Za-z]{22}$/.test(v))throw new Error('Invalid Dovetail resource id');return v}
export function bounded(v:string,name:string,max:number){const s=v.trim();if(!s||s.length>max)throw new Error('Invalid '+name);return s}
