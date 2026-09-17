export type Risk='READ'|'WRITE'|'HIGH_RISK'|'DESTRUCTIVE';
export class ApprovalError extends Error{}
export function requireApproval(risk:Risk, approved:boolean){
 const writeApproval=(process.env.UPDOWN_WRITE_APPROVAL??'true')!=='false';
 if(risk==='DESTRUCTIVE' && process.env.UPDOWN_DESTRUCTIVE_ENABLED!=='true') throw new ApprovalError('Destructive tools are disabled. Set UPDOWN_DESTRUCTIVE_ENABLED=true and provide explicit approval.');
 if((risk==='HIGH_RISK'||risk==='DESTRUCTIVE'||(risk==='WRITE'&&writeApproval))&&!approved) throw new ApprovalError(`Explicit human approval required for ${risk} operation`);
}
export function token(v:string){if(!/^[A-Za-z0-9_-]{2,128}$/.test(v))throw new Error('Invalid token');return v}
export function recipientId(v:string){if(!/^[a-z_]+:[A-Za-z0-9_-]+$/.test(v))throw new Error('Invalid recipient id');return v}
export function safeUrl(v:string){const u=new URL(v);if(!['http:','https:','tcp:','tcps:'].includes(u.protocol))throw new Error('Unsupported URL scheme');if(['localhost','127.0.0.1','::1'].includes(u.hostname))throw new Error('Loopback targets are blocked');return v}
