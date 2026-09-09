import {z} from 'zod';

export type Config={host:string;apiKey:string;timeoutMs:number;maxReadRetries:number;requireWriteApproval:boolean;destructiveEnabled:boolean};
const bool=(v:string|undefined,d:boolean)=>v===undefined?d:v.toLowerCase()==='true';
export function loadConfig(env:NodeJS.ProcessEnv=process.env):Config{
  const host=z.string().url().parse(env.TYPESENSE_HOST);
  const u=new URL(host);
  if(u.protocol!=='https:'&&u.hostname!=='localhost'&&u.hostname!=='127.0.0.1') throw new Error('TYPESENSE_HOST must use HTTPS except for localhost');
  const allowed=(env.TYPESENSE_ALLOWED_HOSTS??'').split(',').map(x=>x.trim().toLowerCase()).filter(Boolean);
  if(!allowed.includes(u.hostname.toLowerCase())&&u.hostname!=='localhost'&&u.hostname!=='127.0.0.1') throw new Error('TYPESENSE_HOST is not in TYPESENSE_ALLOWED_HOSTS');
  const apiKey=z.string().min(8).parse(env.TYPESENSE_API_KEY);
  const timeoutMs=z.coerce.number().int().min(1000).max(120000).parse(env.TYPESENSE_REQUEST_TIMEOUT_MS??15000);
  const maxReadRetries=z.coerce.number().int().min(0).max(5).parse(env.TYPESENSE_MAX_READ_RETRIES??3);
  return{host:host.replace(/\/$/,''),apiKey,timeoutMs,maxReadRetries,requireWriteApproval:bool(env.TYPESENSE_REQUIRE_WRITE_APPROVAL,true),destructiveEnabled:bool(env.TYPESENSE_DESTRUCTIVE_ENABLED,false)};
}
