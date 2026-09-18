export class KitError extends Error { constructor(public status:number, message:string, public retryAfter?:number){super(message)} }
export class KitClient {
  constructor(private apiKey:string, private base=process.env.KIT_BASE_URL||'https://api.kit.com/v4', private timeout=Number(process.env.KIT_TIMEOUT_MS||15000), private retries=Number(process.env.KIT_MAX_RETRIES||2)){if(!apiKey) throw new Error('KIT_API_KEY is required')}
  async request(method:string,path:string,body?:unknown,query?:Record<string,string|number|undefined>){
    const u=new URL(this.base.replace(/\/$/,'')+path); for(const [k,v] of Object.entries(query||{})) if(v!==undefined) u.searchParams.set(k,String(v));
    for(let attempt=0;;attempt++){
      const c=new AbortController(), timer=setTimeout(()=>c.abort(),this.timeout);
      try { const r=await fetch(u,{method,headers:{'X-Kit-Api-Key':this.apiKey,'Content-Type':'application/json','Accept':'application/json'},body:body===undefined?undefined:JSON.stringify(body),signal:c.signal});
        const text=await r.text(); let data:unknown; try{data=text?JSON.parse(text):{}}catch{data={message:text}}
        if(r.ok) return data;
        const retryAfter=Number(r.headers.get('retry-after')||0); const retryable=r.status===429||r.status>=500;
        if(retryable&&attempt<this.retries){await new Promise(x=>setTimeout(x,retryAfter?retryAfter*1000:250*2**attempt));continue}
        throw new KitError(r.status,`Kit API ${r.status}: ${typeof data==='object'?JSON.stringify(data):String(data)}`,retryAfter||undefined);
      } catch(e){ if(e instanceof KitError) throw e; if(attempt<this.retries){await new Promise(x=>setTimeout(x,250*2**attempt));continue} throw e } finally{clearTimeout(timer)}
    }
  }
}