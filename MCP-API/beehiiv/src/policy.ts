export type Risk='READ'|'WRITE'|'HIGH_RISK'|'DESTRUCTIVE';
export type Approval={confirmed?:boolean;reason?:string};
export type Policy={readOnly:boolean;allowWrite:boolean;approvalMode:'required'|'disabled'};
export function assertAllowed(risk:Risk,approval:Approval|undefined,p:Policy){if(risk==='READ')return;if(p.readOnly)throw new Error('Write blocked: BEEHIIV_READ_ONLY=true');if(!p.allowWrite)throw new Error('Write blocked: BEEHIIV_ALLOW_WRITE=false');if(risk==='DESTRUCTIVE')throw new Error('Destructive operations are disabled');if(p.approvalMode==='required'&&(!approval?.confirmed||!approval.reason?.trim()))throw new Error('Explicit human approval is required for this operation');}
