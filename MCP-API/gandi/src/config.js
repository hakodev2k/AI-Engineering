const bool=(v)=>String(v).toLowerCase()==='true';
export function loadConfig(env=process.env){
 const token=env.GANDI_PAT?.trim(); if(!token) throw new Error('GANDI_PAT is required');
 const base=env.GANDI_API_BASE||'https://api.gandi.net/v5';
 const u=new URL(base); if(u.protocol!=='https:') throw new Error('GANDI_API_BASE must use HTTPS');
 if(!['api.gandi.net','api.sandbox.gandi.net'].includes(u.hostname)) throw new Error('GANDI_API_BASE host is not allowed');
 return {token,base:u.toString().replace(/\/$/,''),timeoutMs:Number(env.GANDI_TIMEOUT_MS||15000),allowWrites:bool(env.GANDI_ALLOW_WRITES),allowDestructive:bool(env.GANDI_ALLOW_DESTRUCTIVE)};
}
