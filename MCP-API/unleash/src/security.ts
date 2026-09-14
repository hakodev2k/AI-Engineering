export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";
export class ValidationError extends Error {}
export class ApprovalError extends Error {}
export const envBool=(n:string,d:boolean)=>process.env[n]==null?d:/^(1|true|yes|on)$/i.test(process.env[n]!);
export function id(v:unknown,n="id"){ if(typeof v!=="string"||!/^[A-Za-z0-9._:-]{1,100}$/.test(v)) throw new ValidationError(`${n} is invalid.`); return v; }
export function flagName(v:unknown){ if(typeof v!=="string"||v.length<1||v.length>100||!/^[A-Za-z0-9._-]+$/.test(v)) throw new ValidationError("featureName is invalid."); return v; }
export function page(v:unknown,d=1){ const n=v==null?d:Number(v); if(!Number.isInteger(n)||n<1||n>10000) throw new ValidationError("page must be 1-10000."); return n; }
export function limit(v:unknown,d=50){ const n=v==null?d:Number(v); if(!Number.isInteger(n)||n<1||n>100) throw new ValidationError("limit must be 1-100."); return n; }
export function approve(risk:Risk, grant?:string){ if(risk==="READ") return; if(risk==="DESTRUCTIVE"&&!envBool("UNLEASH_ENABLE_DESTRUCTIVE",false)) throw new ApprovalError("Destructive tools are disabled."); const needed=risk!=="WRITE"||envBool("UNLEASH_REQUIRE_WRITE_APPROVAL",true); if(!needed)return; const expected=process.env.UNLEASH_APPROVAL_TOKEN; if(!expected||grant!==expected) throw new ApprovalError("Explicit human approval is required."); }
