import { createHmac,timingSafeEqual } from 'node:crypto';import type { Config } from './config.js';
export type Risk='READ'|'WRITE';
export function fingerprint(secret:string,tool:string,payload:unknown){return createHmac('sha256',secret).update(tool+'\n'+JSON.stringify(payload)).digest('hex');}
export function enforce(cfg:Config,risk:Risk,tool:string,payload:unknown,approval?:string){if(risk==='READ')return;if(!cfg.allowWrites)throw new Error('WRITE_DISABLED');if(!cfg.approvalSecret)throw new Error('APPROVAL_NOT_CONFIGURED');const expected=fingerprint(cfg.approvalSecret,tool,payload);if(!approval||approval.length!==expected.length||!timingSafeEqual(Buffer.from(approval),Buffer.from(expected)))throw new Error('WRITE_APPROVAL_REQUIRED');}
