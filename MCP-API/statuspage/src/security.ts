export type Risk='READ'|'WRITE'|'HIGH_RISK'|'DESTRUCTIVE';
export function requireApproval(risk:Risk,allowWrites:boolean,approved?:boolean){if(risk==='READ')return;if(!allowWrites)throw new Error('Write operations are disabled by policy');if(!approved)throw new Error(`Explicit human approval required for ${risk} operation`)}
export function id(v:string){if(!/^[A-Za-z0-9_-]+$/.test(v))throw new Error('Invalid identifier');return v}
