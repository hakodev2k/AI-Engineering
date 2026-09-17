export class ConfigCatError extends Error { constructor(message,status,retryAfter){super(message);this.name='ConfigCatError';this.status=status;this.retryAfter=retryAfter;} }
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
export function loadConfig(env=process.env){
 const user=env.CONFIGCAT_API_USER, pass=env.CONFIGCAT_API_PASS;
 if(!user||!pass) throw new Error('CONFIGCAT_API_USER and CONFIGCAT_API_PASS are required');
 const base=env.CONFIGCAT_BASE_URL||'https://api.configcat.com'; const u=new URL(base);
 if(u.protocol!=='https:'||u.pathname!=='/'||u.search||u.hash) throw new Error('CONFIGCAT_BASE_URL must be an HTTPS origin');
 return {user,pass,base:u.origin,timeout:Math.min(120000,Math.max(1000,Number(env.CONFIGCAT_TIMEOUT_MS||15000))),retries:Math.min(5,Math.max(0,Number(env.CONFIGCAT_MAX_READ_RETRIES||2))),requireApproval:env.CONFIGCAT_REQUIRE_WRITE_APPROVAL!=='false',allowHighRisk:env.CONFIGCAT_ALLOW_HIGH_RISK==='true'};
}
export class ConfigCatClient{
 constructor(config,fetchImpl=fetch){this.c=config;this.fetch=fetchImpl;}
 async request(method,path,{body,query,retry=true}={}){
  if(!path.startsWith('/v1/')&&!path.startsWith('/v2/')) throw new Error('Unsupported ConfigCat API path');
  const url=new URL(path,this.c.base); if(url.origin!==this.c.base) throw new Error('Cross-origin request blocked');
  for(const [k,v] of Object.entries(query||{})) if(v!==undefined&&v!==null&&v!=='') url.searchParams.set(k,String(v));
  const attempts=method==='GET'&&retry?this.c.retries+1:1;
  for(let i=0;i<attempts;i++){
   const ac=new AbortController(),timer=setTimeout(()=>ac.abort(),this.c.timeout);
   try{
    const res=await this.fetch(url,{method,signal:ac.signal,headers:{Authorization:`Basic ${Buffer.from(`${this.c.user}:${this.c.pass}`).toString('base64')}`,'Content-Type':'application/json','Accept':'application/json'},body:body===undefined?undefined:JSON.stringify(body)});
    const text=await res.text(); let data=null; try{data=text?JSON.parse(text):null}catch{data={raw:text.slice(0,4096)}}
    if(res.ok) return {data,rateLimit:{remaining:res.headers.get('x-rate-limit-remaining'),reset:res.headers.get('x-rate-limit-reset')}};
    const ra=res.headers.get('retry-after'); if(i+1<attempts&&(res.status===429||res.status>=500)){await sleep(ra?Math.min(30000,Number(ra)*1000):Math.min(5000,250*2**i));continue;}
    throw new ConfigCatError(`ConfigCat API ${res.status}`,res.status,ra||undefined);
   }catch(e){if(e.name==='AbortError') throw new ConfigCatError('ConfigCat request timed out',408); if(i+1<attempts&&!(e instanceof ConfigCatError)){await sleep(Math.min(5000,250*2**i));continue;} throw e;}finally{clearTimeout(timer);}
  }
 }
}
