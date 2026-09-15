import type {Config} from './config.js';
export type Risk='READ'|'WRITE'|'DESTRUCTIVE';
export function requirePermission(config:Config,risk:Risk,approved=false){
 if(risk==='READ') return;
 if(!config.allowWrites) throw new Error('WRITE operations are disabled by configuration');
 if(!approved) throw new Error('Explicit human approval is required');
 if(risk==='DESTRUCTIVE'&&!config.allowDestructive) throw new Error('DESTRUCTIVE operations are disabled by configuration');
}
export function assertUuid(v:string,name='id'){if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v)) throw new Error(`${name} must be a UUID`)}
export function assertRange(startAt:number,endAt:number){if(!Number.isSafeInteger(startAt)||!Number.isSafeInteger(endAt)||startAt<0||endAt<=startAt) throw new Error('startAt/endAt must be valid millisecond timestamps with endAt > startAt')}
