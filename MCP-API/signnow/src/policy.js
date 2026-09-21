export const Risk=Object.freeze({READ:'READ',WRITE:'WRITE',HIGH_RISK:'HIGH_RISK',DESTRUCTIVE:'DESTRUCTIVE'});
export function requireApproval(config,risk,approved){
 if(risk===Risk.READ)return;
 if(!config.allowWrites)throw new Error('Write operations are disabled; set SIGNNOW_ALLOW_WRITES=true after operator review');
 if(!approved)throw new Error(`${risk} operation requires explicit approved=true`);
}
export function assertId(value,name='id'){if(!/^[A-Za-z0-9_-]{4,128}$/.test(value))throw new Error(`Invalid ${name}`);return value;}
export function assertBase64(value){if(value.length>20_000_000||!/^[A-Za-z0-9+/=\r\n]+$/.test(value))throw new Error('Invalid or oversized base64 document');return value;}
