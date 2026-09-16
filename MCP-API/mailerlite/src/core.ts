export type Risk='READ'|'WRITE'|'HIGH_RISK'|'DESTRUCTIVE';
export class ConnectorError extends Error{constructor(public code:string,message:string,public status?:number,public retryAfter?:number){super(message)}}
export function requireApproval(risk:Risk,approved:boolean,writesAllowed:boolean){if(risk==='READ')return;if(risk==='WRITE'&&writesAllowed)return;if(!approved)throw new ConnectorError('APPROVAL_REQUIRED',`Explicit approval required for ${risk} operation`)}
export function cleanBaseUrl(v:string){const u=new URL(v);if(u.protocol!=='https:')throw new Error('MailerLite base URL must use HTTPS');if(u.username||u.password)throw new Error('Credentials in URL are forbidden');return u.toString().replace(/\/$/,'')}
