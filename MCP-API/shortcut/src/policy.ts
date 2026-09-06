import type { Config, Permission } from "./config.js";
export type Risk="READ"|"WRITE";
export function assertAllowed(risk:Risk, tool:string, args:Record<string,unknown>, config:Config){
 const needed:Permission=risk;
 if(!config.permissions.has(needed)) throw new Error(`${tool} requires ${needed} permission.`);
 if(risk==="WRITE"&&config.requireWriteApproval&&args.approved!==true) throw new Error(`${tool} requires explicit human approval: set approved=true after approval.`);
}
