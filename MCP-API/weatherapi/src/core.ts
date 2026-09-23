export type Risk = 'READ'|'WRITE'|'HIGH_RISK'|'DESTRUCTIVE';
export class ConnectorError extends Error { constructor(public code:string,message:string,public status?:number,public retryAfter?:number){super(message);} }
export function config(env=process.env){
 const key=env.WEATHERAPI_KEY?.trim(); if(!key) throw new ConnectorError('AUTH_CONFIG','WEATHERAPI_KEY is required');
 const base=env.WEATHERAPI_BASE_URL ?? 'https://api.weatherapi.com/v1'; const u=new URL(base);
 if(u.protocol!=='https:' || u.hostname!=='api.weatherapi.com') throw new ConnectorError('UNSAFE_BASE_URL','Base URL must be https://api.weatherapi.com/v1');
 return {key,base:u.toString().replace(/\/$/,''),timeout:Number(env.WEATHERAPI_TIMEOUT_MS??10000),retries:Math.min(3,Math.max(0,Number(env.WEATHERAPI_MAX_RETRIES??2)))};
}
export const sleep=(ms:number)=>new Promise(r=>setTimeout(r,ms));
