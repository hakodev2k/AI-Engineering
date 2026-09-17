export type Risk='READ'|'WRITE'|'HIGH_RISK'|'DESTRUCTIVE';
export class PolicyError extends Error{}
export function authorize(risk:Risk,approved=false){const allowed=new Set((process.env.DAYTONA_ALLOWED_RISKS??'READ,WRITE').split(',').map(x=>x.trim()));if(!allowed.has(risk))throw new PolicyError(`Risk ${risk} is disabled`);if((risk==='HIGH_RISK'||risk==='DESTRUCTIVE')&&!approved)throw new PolicyError('Explicit human approval required');if(risk==='WRITE'&&(process.env.DAYTONA_REQUIRE_WRITE_APPROVAL??'true')==='true'&&!approved)throw new PolicyError('Write approval required');}
