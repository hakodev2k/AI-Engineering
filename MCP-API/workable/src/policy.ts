import type { Config, Permission } from "./config.js";
export type Risk="READ"|"WRITE"|"HIGH_RISK";
const need:Record<Risk,Permission>={READ:"read",WRITE:"write",HIGH_RISK:"high_risk"};
export function assertAllowed(risk:Risk,args:Record<string,unknown>,config:Config){
  const p=need[risk]; if(!config.permissions.has(p)) throw new Error(`Permission denied: ${p} capability is not enabled.`);
  if(risk==="HIGH_RISK" && args.approved!==true) throw new Error("Explicit human approval is required (approved=true).");
  if(risk==="WRITE" && config.requireWriteApproval && args.approved!==true) throw new Error("Write approval is required (approved=true).");
}
