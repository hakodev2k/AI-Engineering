export type BitlyConfig={token:string;baseUrl:string;timeoutMs:number;maxRetries:number;requireWriteApproval:boolean;destructiveEnabled:boolean};
function bool(name:string, fallback:boolean){const v=process.env[name];return v===undefined?fallback:v.toLowerCase()==='true'}
function int(name:string,fallback:number,min:number,max:number){const n=Number(process.env[name]??fallback);if(!Number.isInteger(n)||n<min||n>max)throw new Error(`${name} must be an integer from ${min} to ${max}`);return n}
export function loadConfig(env:NodeJS.ProcessEnv=process.env):BitlyConfig{
  const token=env.BITLY_ACCESS_TOKEN?.trim();if(!token)throw new Error('BITLY_ACCESS_TOKEN is required');
  const baseUrl=env.BITLY_API_BASE?.trim()||'https://api-ssl.bitly.com/v4';const u=new URL(baseUrl);
  if(u.protocol!=='https:'||u.hostname!=='api-ssl.bitly.com'||!u.pathname.startsWith('/v4'))throw new Error('BITLY_API_BASE must be HTTPS on api-ssl.bitly.com under /v4');
  return{token,baseUrl:baseUrl.replace(/\/$/,''),timeoutMs:int('BITLY_REQUEST_TIMEOUT_MS',15000,1000,120000),maxRetries:int('BITLY_MAX_RETRIES',2,0,5),requireWriteApproval:bool('BITLY_REQUIRE_WRITE_APPROVAL',true),destructiveEnabled:bool('BITLY_DESTRUCTIVE_ENABLED',false)};
}
