export type Risk='READ'|'WRITE'|'HIGH_RISK';
export function requireApproval(action:string,risk:Risk,env=process.env){
  if(risk==='READ') return;
  const mode=(env.VIMEO_APPROVAL_MODE??'required').toLowerCase();
  if(mode==='disabled') throw new Error(`Write operations are disabled: ${action}`);
  const approved=new Set((env.VIMEO_APPROVED_ACTIONS??'').split(',').map(x=>x.trim()).filter(Boolean));
  if(mode!=='none'&&!approved.has(action)) throw new Error(`Human approval required for ${action}; add the exact action to VIMEO_APPROVED_ACTIONS for this execution context`);
}
export function id(value:string,label:string){if(!/^\d+$/.test(value))throw new Error(`${label} must be a numeric Vimeo id`);return value;}
export function text(value:string,label:string,max:number){const v=value.trim();if(!v||v.length>max)throw new Error(`${label} must be 1..${max} characters`);return v;}
