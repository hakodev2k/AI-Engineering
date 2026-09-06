export type Permission = "READ" | "WRITE";
export interface Config { token:string; baseUrl:string; permissions:Set<Permission>; requireWriteApproval:boolean; timeoutMs:number; maxRetries:number; }
const bool=(v:string|undefined,d:boolean)=>v===undefined?d:["1","true","yes","on"].includes(v.toLowerCase());
const int=(v:string|undefined,d:number,min:number,max:number)=>{const n=Number(v??d); if(!Number.isInteger(n)||n<min||n>max) throw new Error(`Invalid integer configuration: ${v}`); return n;};
export function loadConfig(env:NodeJS.ProcessEnv=process.env):Config{
 const token=env.SHORTCUT_API_TOKEN?.trim(); if(!token) throw new Error("SHORTCUT_API_TOKEN is required.");
 const baseUrl=(env.SHORTCUT_API_BASE_URL?.trim()||"https://api.app.shortcut.com/api/v3").replace(/\/$/,"");
 const u=new URL(baseUrl); if(u.protocol!=="https:"||u.hostname!=="api.app.shortcut.com") throw new Error("SHORTCUT_API_BASE_URL must use https://api.app.shortcut.com to prevent SSRF.");
 const raw=(env.SHORTCUT_PERMISSIONS||"read").split(",").map(x=>x.trim().toLowerCase()).filter(Boolean);
 const permissions=new Set<Permission>(); for(const p of raw){if(p==="read") permissions.add("READ"); else if(p==="write") permissions.add("WRITE"); else throw new Error(`Unknown permission: ${p}`);} if(permissions.has("WRITE")) permissions.add("READ");
 return {token,baseUrl,permissions,requireWriteApproval:bool(env.SHORTCUT_REQUIRE_WRITE_APPROVAL,true),timeoutMs:int(env.SHORTCUT_TIMEOUT_MS,15000,1000,120000),maxRetries:int(env.SHORTCUT_MAX_RETRIES,2,0,5)};
}
