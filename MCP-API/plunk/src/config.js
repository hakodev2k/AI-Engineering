const bool=(v,d=false)=>v==null?d:/^(1|true|yes)$/i.test(v);
export function loadConfig(env=process.env){
 const key=env.PLUNK_API_KEY;
 if(!key||!key.startsWith('sk_')) throw new Error('PLUNK_API_KEY must be a server-side secret key (sk_*)');
 const raw=env.PLUNK_API_URL||'https://next-api.useplunk.com';
 const url=new URL(raw); if(url.protocol!=='https:'&&url.hostname!=='localhost'&&url.hostname!=='127.0.0.1') throw new Error('PLUNK_API_URL must use HTTPS except localhost');
 return {apiKey:key,baseUrl:url.toString().replace(/\/$/,''),readOnly:bool(env.PLUNK_READ_ONLY,true),allowWrites:bool(env.PLUNK_ALLOW_WRITES,false),allowSends:bool(env.PLUNK_ALLOW_SENDS,false),timeoutMs:Math.min(Math.max(Number(env.PLUNK_TIMEOUT_MS||15000),1000),60000),maxRetries:Math.min(Math.max(Number(env.PLUNK_MAX_RETRIES||2),0),4)};
}
