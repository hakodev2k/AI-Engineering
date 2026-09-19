import {PlainClient} from '@team-plain/typescript-sdk';
export type Risk='READ'|'WRITE'|'HIGH_RISK'|'DESTRUCTIVE';
export class ApprovalError extends Error{}
export function cfg(){const apiKey=process.env.PLAIN_API_KEY;if(!apiKey)throw new Error('PLAIN_API_KEY is required');return{apiKey,approveWrites:process.env.PLAIN_APPROVE_WRITES==='true'};}
export function approval(risk:Risk,explicit=false){if(risk==='READ')return;if(risk==='DESTRUCTIVE'&&!explicit)throw new ApprovalError('Destructive operation requires explicit approval');if(risk!=='DESTRUCTIVE'&&!cfg().approveWrites&&!explicit)throw new ApprovalError(`${risk} requires approval`);}
let singleton:PlainClient|undefined;
export function client(){return singleton??=new PlainClient({apiKey:cfg().apiKey});}
export async function call(method:string,input:unknown){const fn=(client() as any)[method];if(typeof fn!=='function')throw new Error(`Installed Plain SDK does not expose ${method}`);const r=await fn.call(client(),input);if(r?.error)throw new Error(`Plain: ${r.error.message??r.error.code??'operation failed'}`);return r?.data??r;}
