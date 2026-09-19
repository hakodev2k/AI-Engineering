export interface KintoneConfig { subdomain:string; apiTokens:string[]; guestSpaceId?:string; timeoutMs:number; maxRetries:number; requireWriteApproval:boolean; enableDestructive:boolean }
const bool=(v:string|undefined,d:boolean)=>v===undefined?d:v.toLowerCase()==='true';
export function loadConfig(env:NodeJS.ProcessEnv=process.env):KintoneConfig {
  const subdomain=(env.KINTONE_SUBDOMAIN??'').trim();
  const apiTokens=(env.KINTONE_API_TOKENS??'').split(',').map(x=>x.trim()).filter(Boolean);
  if(!/^[a-z0-9][a-z0-9-]{0,62}$/i.test(subdomain)) throw new Error('KINTONE_SUBDOMAIN is missing or invalid');
  if(apiTokens.length<1||apiTokens.length>20) throw new Error('KINTONE_API_TOKENS must contain 1-20 tokens');
  const timeoutMs=Number(env.KINTONE_TIMEOUT_MS??15000), maxRetries=Number(env.KINTONE_MAX_RETRIES??3);
  if(!Number.isInteger(timeoutMs)||timeoutMs<1000||timeoutMs>120000) throw new Error('Invalid KINTONE_TIMEOUT_MS');
  if(!Number.isInteger(maxRetries)||maxRetries<0||maxRetries>5) throw new Error('Invalid KINTONE_MAX_RETRIES');
  const guestSpaceId=env.KINTONE_GUEST_SPACE_ID?.trim();
  if(guestSpaceId&&!/^\d+$/.test(guestSpaceId)) throw new Error('Invalid KINTONE_GUEST_SPACE_ID');
  return {subdomain,apiTokens,guestSpaceId,timeoutMs,maxRetries,requireWriteApproval:bool(env.KINTONE_REQUIRE_WRITE_APPROVAL,true),enableDestructive:bool(env.KINTONE_ENABLE_DESTRUCTIVE,false)};
}
