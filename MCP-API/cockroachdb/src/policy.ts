export type Risk="READ"|"WRITE"|"HIGH_RISK"|"DESTRUCTIVE";
export type Approval={confirmed?:boolean;reason?:string};
export class PolicyError extends Error{constructor(message:string){super(message);this.name="PolicyError"}}
export function assertAllowed(risk:Risk,approval:Approval|undefined,cfg:{readOnly:boolean;allowWrite:boolean;approvalMode:"required"|"disabled"}){
 if(risk==="READ")return;
 if(risk==="DESTRUCTIVE")throw new PolicyError("Destructive operations are disabled by this connector.");
 if(cfg.readOnly)throw new PolicyError("Writes are disabled because COCKROACHDB_READ_ONLY=true.");
 if(!cfg.allowWrite)throw new PolicyError("Writes are disabled because COCKROACHDB_ALLOW_WRITE=false.");
 if(cfg.approvalMode==="required"&&(!approval?.confirmed||!approval.reason?.trim()))throw new PolicyError("Explicit human approval is required for this write operation.");
}
