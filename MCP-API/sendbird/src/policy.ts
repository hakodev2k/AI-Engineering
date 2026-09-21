export type Risk='READ'|'WRITE'|'HIGH_RISK'|'DESTRUCTIVE';
export function requireApproval(risk:Risk, approved:boolean, env=process.env){if(risk==='READ')return;const configured=(env.SENDBIRD_WRITE_APPROVAL_REQUIRED??'true').toLowerCase()!=='false';if((configured||risk!=='WRITE')&&!approved)throw new Error(`Human approval required for ${risk} operation`)}
export const clean=(v:string,name:string,max=256)=>{const x=v.trim();if(!x||x.length>max||/[\u0000-\u001f]/.test(x))throw new Error(`Invalid ${name}`);return x};
export const qs=(o:Record<string,string|number|undefined>)=>{const p=new URLSearchParams();for(const[k,v]of Object.entries(o))if(v!==undefined)p.set(k,String(v));return p.toString()};
