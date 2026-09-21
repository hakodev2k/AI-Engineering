export class KagiError extends Error { constructor(public status:number, message:string, public retryAfter?:string){super(message)} }
export class KagiClient {
  private token:string; private timeout:number; private retries:number;
  constructor(env=process.env){ this.token=env.KAGI_API_TOKEN?.trim()||''; if(!this.token) throw new Error('KAGI_API_TOKEN is required'); this.timeout=Number(env.KAGI_TIMEOUT_MS||15000); this.retries=Math.min(4,Math.max(0,Number(env.KAGI_MAX_RETRIES||2))); }
  private async request(path:string, init:RequestInit={}, retryable=true){
    for(let attempt=0;;attempt++){
      const ctrl=new AbortController(); const timer=setTimeout(()=>ctrl.abort(),this.timeout);
      try{
        const r=await fetch(`https://kagi.com${path}`,{...init,signal:ctrl.signal,headers:{Authorization:`Bot ${this.token}`,Accept:'application/json',...(init.body?{'Content-Type':'application/json'}:{}),...init.headers}});
        const text=await r.text(); let body:any; try{body=text?JSON.parse(text):null}catch{body={raw:text}}
        if(r.ok) return body;
        const ra=r.headers.get('retry-after')||undefined;
        if((r.status===429||r.status>=500)&&retryable&&attempt<this.retries){ const wait=ra?Math.min(10000,Number(ra)*1000):Math.min(5000,250*2**attempt); await new Promise(x=>setTimeout(x,wait)); continue; }
        throw new KagiError(r.status,body?.error?.message||body?.message||`Kagi HTTP ${r.status}`,ra);
      } catch(e:any){ if(e?.name==='AbortError') throw new KagiError(408,'Kagi request timed out'); throw e; } finally{clearTimeout(timer)}
    }
  }
  search(q:string,limit=10){return this.request(`/api/v1/search?q=${encodeURIComponent(q)}&limit=${limit}`)}
  enrich(kind:'web'|'news',q:string){return this.request(`/api/v0/enrich/${kind}?q=${encodeURIComponent(q)}`)}
  fastgpt(query:string,cache=true){return this.request('/api/v0/fastgpt',{method:'POST',body:JSON.stringify({query,cache})})}
  summarize(input:{url?:string;text?:string;engine?:'cecil'|'agnes'|'muriel';summary_type?:'summary'|'takeaway';target_language?:string;cache?:boolean}){return this.request('/api/v0/summarize',{method:'POST',body:JSON.stringify(input)})}
}
