import { createHmac, timingSafeEqual } from 'node:crypto';

export type Risk = 'READ'|'WRITE'|'HIGH_RISK'|'DESTRUCTIVE';
export type Config = { apiKey:string; baseUrl:string; apiVersion:string; timeoutMs:number; maxReadRetries:number; requireWriteApproval:boolean; destructiveEnabled:boolean; approvalSecret?:string };

const int=(v:string|undefined,d:number,min:number,max:number)=>{const n=v===undefined?d:Number(v);if(!Number.isInteger(n)||n<min||n>max)throw new Error(`Invalid integer configuration: ${v}`);return n};
const bool=(v:string|undefined,d:boolean)=>v===undefined?d:v==='true'?true:v==='false'?false:(()=>{throw new Error(`Invalid boolean configuration: ${v}`)})();

export function loadConfig(env:NodeJS.ProcessEnv=process.env):Config{
 const apiKey=env.BUTTONDOWN_API_KEY?.trim(); if(!apiKey) throw new Error('BUTTONDOWN_API_KEY is required');
 const baseUrl=env.BUTTONDOWN_API_BASE_URL??'https://api.buttondown.com/v1'; const u=new URL(baseUrl);
 if(u.protocol!=='https:'||u.hostname!=='api.buttondown.com'||u.username||u.password||u.search||u.hash) throw new Error('BUTTONDOWN_API_BASE_URL must be the official HTTPS API origin/path');
 return {apiKey,baseUrl:baseUrl.replace(/\/$/,''),apiVersion:env.BUTTONDOWN_API_VERSION??'2026-04-01',timeoutMs:int(env.BUTTONDOWN_TIMEOUT_MS,15000,1000,120000),maxReadRetries:int(env.BUTTONDOWN_MAX_READ_RETRIES,2,0,5),requireWriteApproval:bool(env.BUTTONDOWN_REQUIRE_WRITE_APPROVAL,true),destructiveEnabled:bool(env.BUTTONDOWN_ENABLE_DESTRUCTIVE,false),approvalSecret:env.BUTTONDOWN_APPROVAL_SECRET};
}
function canonical(v:unknown):string{if(Array.isArray(v))return `[${v.map(canonical).join(',')}]`;if(v&&typeof v==='object')return `{${Object.entries(v as Record<string,unknown>).filter(([k])=>k!=='approvalToken').sort(([a],[b])=>a.localeCompare(b)).map(([k,x])=>`${JSON.stringify(k)}:${canonical(x)}`).join(',')}}`;return JSON.stringify(v)}
export function approvalDigest(secret:string,tool:string,input:unknown){return createHmac('sha256',secret).update(`${tool}\n${canonical(input)}`).digest('hex')}
export function authorize(cfg:Config,tool:string,risk:Risk,input:Record<string,unknown>){if(risk==='READ')return;if(risk==='DESTRUCTIVE'&&!cfg.destructiveEnabled)throw new Error('Destructive operations are disabled');if(risk==='WRITE'&&!cfg.requireWriteApproval)return;const token=typeof input.approvalToken==='string'?input.approvalToken:'';if(!cfg.approvalSecret||!/^[a-f0-9]{64}$/.test(token))throw new Error('Explicit human approval is required');const expected=approvalDigest(cfg.approvalSecret,tool,input);if(!timingSafeEqual(Buffer.from(expected),Buffer.from(token)))throw new Error('Approval does not match this exact action')}
