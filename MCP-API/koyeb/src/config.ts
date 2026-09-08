export type Config={token:string;baseUrl:string;timeoutMs:number;requireWriteApproval:boolean;destructiveEnabled:boolean};
export function loadConfig(env=process.env):Config{
  const token=env.KOYEB_TOKEN?.trim(); if(!token) throw new Error('KOYEB_TOKEN is required');
  const baseUrl=(env.KOYEB_API_BASE||'https://app.koyeb.com').replace(/\/$/,'');
  if(!/^https:\/\//.test(baseUrl)) throw new Error('KOYEB_API_BASE must be HTTPS');
  const timeoutMs=Number(env.KOYEB_TIMEOUT_MS||20000); if(!Number.isFinite(timeoutMs)||timeoutMs<1000||timeoutMs>120000) throw new Error('Invalid KOYEB_TIMEOUT_MS');
  return {token,baseUrl,timeoutMs,requireWriteApproval:(env.KOYEB_REQUIRE_WRITE_APPROVAL||'true')!=='false',destructiveEnabled:env.KOYEB_ENABLE_DESTRUCTIVE==='true'};
}
