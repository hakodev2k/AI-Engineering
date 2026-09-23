export const Risk=Object.freeze({READ:'READ',WRITE:'WRITE',HIGH_RISK:'HIGH_RISK',DESTRUCTIVE:'DESTRUCTIVE'});
export function requireApproval(cfg,provided,risk){if(risk===Risk.READ)return;if(!cfg.approvalToken||provided!==cfg.approvalToken)throw new Error(`Human approval required for ${risk} operation`);}
