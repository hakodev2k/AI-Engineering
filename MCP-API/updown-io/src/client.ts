export class UpdownError extends Error{constructor(public status:number,public retryAfter?:number,message='updown.io request failed'){super(message)}}
const sleep=(ms:number)=>new Promise(r=>setTimeout(r,ms));
export class UpdownClient{
 private base=(process.env.UPDOWN_API_BASE_URL||'https://updown.io/api').replace(/\/$/,'');
 private timeout=Number(process.env.UPDOWN_TIMEOUT_MS||10000);
 private key=process.env.UPDOWN_API_KEY||'';
 constructor(private fetcher:typeof fetch=fetch){if(!this.key)throw new Error('UPDOWN_API_KEY is required')}
 async request(path:string,init:RequestInit={},query:Record<string,unknown>={}){const u=new URL(this.base+path);for(const[k,v]of Object.entries(query))if(v!==undefined)u.searchParams.set(k,String(v));for(let a=0;a<4;a++){const c=new AbortController();const t=setTimeout(()=>c.abort(),this.timeout);try{const r=await this.fetcher(u,{...init,headers:{'X-API-KEY':this.key,'Accept':'application/json','Content-Type':'application/json',...init.headers},signal:c.signal});clearTimeout(t);if(r.ok)return r.status===204?null:r.json();const ra=Number(r.headers.get('retry-after')||0);if([429,500,502,503,504].includes(r.status)&&a<3){await sleep(ra?ra*1000:250*2**a);continue}throw new UpdownError(r.status,ra||undefined,await r.text())}catch(e){clearTimeout(t);if(e instanceof UpdownError)throw e;if(a<3&&(!init.method||init.method==='GET')){await sleep(250*2**a);continue}throw e}}}
 get(p:string,q:Record<string,unknown>={}){return this.request(p,{},q)}
 post(p:string,b:unknown){return this.request(p,{method:'POST',body:JSON.stringify(b)})}
 put(p:string,b:unknown){return this.request(p,{method:'PUT',body:JSON.stringify(b)})}
 del(p:string){return this.request(p,{method:'DELETE'})}
}
