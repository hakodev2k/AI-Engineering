export type Risk='READ'|'WRITE'|'HIGH_RISK'|'DESTRUCTIVE';
export class ApprovalError extends Error {}
export function requireApproval(risk:Risk, approved:boolean|undefined, requireWrite=true){ if(risk==='READ')return; if(risk==='WRITE'&&!requireWrite)return; if(approved!==true)throw new ApprovalError(`${risk} operation requires explicit approval`); }
export function validateMcpUrl(raw:string){ const u=new URL(raw); if(u.protocol!=='https:'||u.username||u.password)throw new Error('MCP URL must be HTTPS without embedded credentials'); return u; }
