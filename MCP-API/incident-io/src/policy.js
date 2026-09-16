export const Risk=Object.freeze({READ:'READ',WRITE:'WRITE',HIGH_RISK:'HIGH_RISK',DESTRUCTIVE:'DESTRUCTIVE'});
export function requireApproval(c,risk,args){if(risk===Risk.DESTRUCTIVE)throw new Error('Destructive operations are disabled');if((risk===Risk.WRITE||risk===Risk.HIGH_RISK)&&c.INCIDENT_IO_APPROVAL_MODE==='write'&&args?.approved!==true)throw new Error('Explicit human approval is required')}
export function cleanArgs(a){const x={...a};delete x.approved;return x}
