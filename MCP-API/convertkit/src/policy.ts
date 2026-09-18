export type Risk='READ'|'WRITE'|'HIGH_RISK'|'DESTRUCTIVE';
export function authorize(risk:Risk, approval?:string){const allowed=new Set((process.env.KIT_ALLOWED_PERMISSIONS||'READ').split(',').map(x=>x.trim()));if(risk==='DESTRUCTIVE')throw new Error('Destructive Kit operations are disabled');if(!allowed.has(risk))throw new Error(`Permission denied: ${risk}`);if(risk==='HIGH_RISK'&&(!process.env.KIT_APPROVAL_TOKEN||approval!==process.env.KIT_APPROVAL_TOKEN))throw new Error('Explicit human approval required');}
export function safeId(v:number){if(!Number.isSafeInteger(v)||v<=0)throw new Error('ID must be a positive integer');return v}
export function safeEmail(v:string){if(v.length>320||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))throw new Error('Invalid email address');return v}
export function cursorQuery(cursor?:string,perPage=50){if(perPage<1||perPage>1000)throw new Error('per_page must be 1..1000');return {after:cursor,per_page:perPage}}
