export type Risk='READ'|'WRITE'|'HIGH_RISK'|'DESTRUCTIVE';
export function requireApproval(risk:Risk, approved?:boolean){ if(risk!=='READ' && process.env.LINEAR_APPROVE_WRITES!=='true' && !approved) throw new Error('HUMAN_APPROVAL_REQUIRED'); }
