export const Risk=Object.freeze({READ:'READ',WRITE:'WRITE',DESTRUCTIVE:'DESTRUCTIVE'});
export function authorize(config,risk,approved=false){
 if(risk===Risk.READ)return;
 if(!approved)throw new Error('Human approval is required for this operation');
 if(!config.allowWrites)throw new Error('Write operations are disabled; set GANDI_ALLOW_WRITES=true outside the agent');
 if(risk===Risk.DESTRUCTIVE&&!config.allowDestructive)throw new Error('Destructive operations are disabled; set GANDI_ALLOW_DESTRUCTIVE=true outside the agent');
}
