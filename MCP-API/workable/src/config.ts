export type Permission = "read" | "write" | "high_risk";
export interface Config { token:string; account?:string; permissions:Set<Permission>; requireWriteApproval:boolean; timeoutMs:number; maxRetries:number; }
const int = (v:string|undefined,d:number,min:number,max:number) => { const n=Number(v); return Number.isFinite(n)?Math.min(max,Math.max(min,Math.trunc(n))):d; };
export function loadConfig(env:NodeJS.ProcessEnv=process.env):Config {
  const token=env.WORKABLE_MCP_ACCESS_TOKEN?.trim(); if(!token) throw new Error("WORKABLE_MCP_ACCESS_TOKEN is required.");
  const raw=(env.WORKABLE_PERMISSIONS||"read").split(",").map(x=>x.trim().toLowerCase()).filter(Boolean);
  const allowed=new Set<Permission>(); for(const p of raw){ if(p!=="read"&&p!=="write"&&p!=="high_risk") throw new Error(`Invalid WORKABLE_PERMISSIONS value: ${p}`); allowed.add(p as Permission); }
  allowed.add("read");
  return { token, account:env.WORKABLE_ACCOUNT?.trim()||undefined, permissions:allowed, requireWriteApproval:(env.WORKABLE_REQUIRE_WRITE_APPROVAL||"true").toLowerCase()!=="false", timeoutMs:int(env.WORKABLE_TIMEOUT_MS,15000,1000,60000), maxRetries:int(env.WORKABLE_MAX_RETRIES,2,0,5) };
}
