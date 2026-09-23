import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

export class AbstractError extends Error { constructor(public status:number, message:string, public retryAfter?:number){super(message)} }
const timeoutMs=()=>Number(process.env.ABSTRACT_REQUEST_TIMEOUT_MS||10000);
const maxRetries=()=>Math.min(4,Math.max(0,Number(process.env.ABSTRACT_MAX_RETRIES||2)));
const key=(name:string)=>{const v=process.env[name];if(!v)throw new Error(`Missing required credential: ${name}`);return v};
const sleep=(ms:number)=>new Promise(r=>setTimeout(r,ms));

export async function request(base:string, apiKeyEnv:string, params:Record<string,string|number|boolean|undefined>, fetcher:typeof fetch=fetch){
  const u=new URL(base); u.searchParams.set('api_key',key(apiKeyEnv));
  for(const [k,v] of Object.entries(params)) if(v!==undefined) u.searchParams.set(k,String(v));
  for(let attempt=0;;attempt++){
    const controller=new AbortController(); const timer=setTimeout(()=>controller.abort(),timeoutMs());
    try{
      const r=await fetcher(u,{signal:controller.signal,headers:{Accept:'application/json','User-Agent':'ai-engineering-abstract-api-mcp/1.0'}});
      if(r.ok) return await r.json();
      const retryAfter=Number(r.headers.get('retry-after')||0);
      if((r.status===429||r.status>=500)&&attempt<maxRetries()){await sleep(retryAfter?retryAfter*1000:250*2**attempt);continue}
      const text=(await r.text()).slice(0,1000); throw new AbstractError(r.status,`Abstract API HTTP ${r.status}: ${text}`,retryAfter||undefined);
    }catch(e){
      if(e instanceof AbstractError) throw e;
      if(attempt<maxRetries() && (e instanceof TypeError || (e instanceof Error&&e.name==='AbortError'))){await sleep(250*2**attempt);continue}
      throw e;
    }finally{clearTimeout(timer)}
  }
}

const text=(data:unknown)=>({content:[{type:'text' as const,text:JSON.stringify({data,trust:'UNTRUSTED_PROVIDER_DATA'},null,2)}]});
const email=z.string().email().max(320); const ip=z.string().ip(); const domain=z.string().min(1).max(253).regex(/^(?=.{1,253}$)(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,63}$/);

export function buildServer(){
 const s=new McpServer({name:'abstract-api',version:'1.0.0'});
 s.tool('abstract.email.validate','READ: validate an email address',{email},async({email})=>text(await request('https://emailvalidation.abstractapi.com/v1/','ABSTRACT_EMAIL_API_KEY',{email})));
 s.tool('abstract.phone.validate','READ: validate and enrich a phone number',{phone:z.string().min(3).max(32),country:z.string().length(2).optional()},async({phone,country})=>text(await request('https://phonevalidation.abstractapi.com/v1/','ABSTRACT_PHONE_API_KEY',{phone,country})));
 s.tool('abstract.ip.lookup','READ: geolocate an IP address',{ip_address:ip},async({ip_address})=>text(await request('https://ipgeolocation.abstractapi.com/v1/','ABSTRACT_IP_API_KEY',{ip_address})));
 s.tool('abstract.ip.risk','READ: return provider security/risk signals for an IP',{ip_address:ip},async({ip_address})=>{const d:any=await request('https://ipgeolocation.abstractapi.com/v1/','ABSTRACT_IP_API_KEY',{ip_address});return text({ip_address:d.ip_address,security:d.security,asn:d.connection?.autonomous_system_number,company:d.company})});
 s.tool('abstract.company.enrich','READ: enrich a company domain',{domain},async({domain})=>text(await request('https://companyenrichment.abstractapi.com/v1/','ABSTRACT_COMPANY_API_KEY',{domain})));
 s.tool('abstract.holiday.list','READ: list public holidays',{country:z.string().length(2),year:z.number().int().min(1900).max(2200),month:z.number().int().min(1).max(12).optional(),day:z.number().int().min(1).max(31).optional()},async(p)=>text(await request('https://holidays.abstractapi.com/v1/','ABSTRACT_HOLIDAYS_API_KEY',p)));
 s.tool('abstract.timezone.current','READ: get current time for a location/timezone',{location:z.string().min(1).max(120)},async({location})=>text(await request('https://timezone.abstractapi.com/v1/current_time/','ABSTRACT_TIMEZONE_API_KEY',{location})));
 s.tool('abstract.exchange.live','READ: retrieve live exchange rates',{base:z.string().length(3).regex(/^[A-Z]{3}$/),target:z.string().length(3).regex(/^[A-Z]{3}$/).optional()},async({base,target})=>text(await request('https://exchange-rates.abstractapi.com/v1/live/','ABSTRACT_EXCHANGE_API_KEY',{base,target})));
 return s;
}
if(process.env.NODE_ENV!=='test'){const server=buildServer();await server.connect(new StdioServerTransport());}
