import {authHeaders,type PapertrailConfig} from './auth.js';
export class PapertrailError extends Error { constructor(public status:number,message:string,public retryAfter?:number){super(message)} }
export class PapertrailClient {
 constructor(private c:PapertrailConfig,private http:typeof fetch=fetch){}
 async request(method:'GET'|'POST'|'PUT',path:string,params:Record<string,unknown>={},signal?:AbortSignal){
  const u=new URL('https://papertrailapp.com/api/v1'+path); let body:string|undefined; const headers:Record<string,string>={...authHeaders(this.c)};
  if(method==='GET') for(const [k,v] of Object.entries(params)) if(v!==undefined&&v!==null&&v!=='') u.searchParams.set(k,String(v));
  else {headers['Content-Type']='application/x-www-form-urlencoded';const f=new URLSearchParams();for(const [k,v] of Object.entries(params)) if(v!==undefined) f.set(k,String(v));body=f.toString();}
  const write=method!=='GET';
  for(let attempt=0;;attempt++){
   const ctl=new AbortController();const timer=setTimeout(()=>ctl.abort(),this.c.timeoutMs);const abort=()=>ctl.abort();signal?.addEventListener('abort',abort,{once:true});
   try {const r=await this.http(u,{method,headers,body,signal:ctl.signal});const text=await r.text();if(r.ok)return text?JSON.parse(text):{};const wait=Number(r.headers.get('x-ratelimit-reset')||r.headers.get('retry-after')||0);if(!write&&(r.status===429||r.status>=500)&&attempt<this.c.maxRetries){await new Promise(x=>setTimeout(x,Math.max(wait*1000,250*2**attempt)));continue;}throw new PapertrailError(r.status,text||r.statusText,wait||undefined)}
   catch(e){if(e instanceof PapertrailError)throw e;if(write||attempt>=this.c.maxRetries||signal?.aborted)throw e;await new Promise(x=>setTimeout(x,250*2**attempt))}
   finally{clearTimeout(timer);signal?.removeEventListener('abort',abort)}
  }
 }
 searchEvents(p:Record<string,unknown>,s?:AbortSignal){return this.request('GET','/events/search.json',p,s)}
 listSystems(s?:AbortSignal){return this.request('GET','/systems.json',{},s)} getSystem(id:number,s?:AbortSignal){return this.request('GET',`/systems/${id}.json`,{},s)}
 listGroups(s?:AbortSignal){return this.request('GET','/groups.json',{},s)} getGroup(id:number,s?:AbortSignal){return this.request('GET',`/groups/${id}.json`,{},s)}
 listSearches(s?:AbortSignal){return this.request('GET','/searches.json',{},s)} getSearch(id:number,s?:AbortSignal){return this.request('GET',`/searches/${id}.json`,{},s)}
 createSearch(name:string,query:string,groupId?:number,s?:AbortSignal){return this.request('POST','/searches.json',{'search[name]':name,'search[query]':query,'search[group_id]':groupId},s)}
 updateSearch(id:number,name:string,query:string,groupId?:number,s?:AbortSignal){return this.request('PUT',`/searches/${id}.json`,{'search[name]':name,'search[query]':query,'search[group_id]':groupId},s)}
 listArchives(s?:AbortSignal){return this.request('GET','/archives.json',{},s)} usage(s?:AbortSignal){return this.request('GET','/account/usage.json',{},s)}
}
