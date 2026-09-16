export const Risk=Object.freeze({READ:'READ',WRITE:'WRITE',HIGH_RISK:'HIGH_RISK',DESTRUCTIVE:'DESTRUCTIVE'});
export function requireApproval(config,risk,args){if(risk===Risk.DESTRUCTIVE)throw new Error('Destructive operations are disabled');if((risk===Risk.WRITE||risk===Risk.HIGH_RISK)&&config.LAUNCHDARKLY_APPROVAL_MODE==='write'&&args?.approved!==true)throw new Error('Explicit human approval is required')}
export function cleanArgs(args){const x={...args};delete x.approved;return x}
