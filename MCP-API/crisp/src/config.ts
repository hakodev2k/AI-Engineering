export type CrispConfig={identifier:string;key:string;tier:'website'|'plugin';websiteId?:string;baseUrl:string;timeoutMs:number;requireWriteApproval:boolean;enableDestructive:boolean};
export function loadConfig(env=process.env):CrispConfig{
  const identifier=env.CRISP_TOKEN_IDENTIFIER?.trim(); const key=env.CRISP_TOKEN_KEY?.trim();
  if(!identifier||!key) throw new Error('CRISP_TOKEN_IDENTIFIER and CRISP_TOKEN_KEY are required');
  const tier=(env.CRISP_TOKEN_TIER||'website') as 'website'|'plugin'; if(!['website','plugin'].includes(tier)) throw new Error('CRISP_TOKEN_TIER must be website or plugin');
  const baseUrl=(env.CRISP_API_BASE||'https://api.crisp.chat').replace(/\/$/,''); if(!/^https:\/\//.test(baseUrl)) throw new Error('CRISP_API_BASE must use HTTPS');
  const timeoutMs=Number(env.CRISP_TIMEOUT_MS||20000); if(!Number.isInteger(timeoutMs)||timeoutMs<1000||timeoutMs>120000) throw new Error('Invalid CRISP_TIMEOUT_MS');
  return {identifier,key,tier,websiteId:env.CRISP_WEBSITE_ID?.trim()||undefined,baseUrl,timeoutMs,requireWriteApproval:(env.CRISP_REQUIRE_WRITE_APPROVAL||'true')!=='false',enableDestructive:env.CRISP_ENABLE_DESTRUCTIVE==='true'};
}
