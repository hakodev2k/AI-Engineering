export type Risk="READ"|"HIGH_RISK"|"DESTRUCTIVE";
export function authorize(risk:Risk,approved:boolean,c:{allowDestructive:boolean}){if(risk==="READ")return;if(risk==="DESTRUCTIVE"&&!c.allowDestructive)throw new Error("Destructive operations are disabled by operator policy");if(!approved)throw new Error("Explicit human approval is required")}
export function id(v:number,label:string){if(!Number.isSafeInteger(v)||v<=0)throw new Error(`Invalid ${label}`);return v}
export function safeName(v:string){if(v.length<1||v.length>128||/[\u0000-\u001f]/.test(v))throw new Error("Invalid database name");return v}
