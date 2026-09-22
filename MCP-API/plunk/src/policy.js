export const Risk=Object.freeze({READ:'READ',WRITE:'WRITE',HIGH_RISK:'HIGH_RISK',DESTRUCTIVE:'DESTRUCTIVE'});
export function authorize(config,risk,approved=false){
 if(risk===Risk.READ)return;
 if(config.readOnly)throw new Error('Permission denied: connector is read-only');
 if(risk===Risk.DESTRUCTIVE)throw new Error('Destructive tools are disabled');
 if(!config.allowWrites)throw new Error('Permission denied: writes are disabled');
 if(risk===Risk.HIGH_RISK&&(!config.allowSends||approved!==true))throw new Error('Explicit human approval and PLUNK_ALLOW_SENDS=true are required');
}
