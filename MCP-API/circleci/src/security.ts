export type Risk='READ'|'WRITE'|'HIGH_RISK'|'DESTRUCTIVE';
export class ApprovalError extends Error{}
export function requireApproval(risk:Risk, approved:boolean){if(risk!=='READ'&&!approved)throw new ApprovalError(`Human approval required for ${risk} operation`)}
export function projectSlug(v:string){if(!/^[A-Za-z0-9._~:/-]{3,300}$/.test(v)||v.includes('..'))throw new Error('Invalid project slug');return encodeURIComponent(v).replace(/%2F/g,'/');}
export function uuid(v:string){if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v))throw new Error('Invalid UUID');return v;}
