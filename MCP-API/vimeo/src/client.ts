export type HttpMethod='GET'|'POST'|'PATCH';
export class VimeoError extends Error { constructor(public status:number, message:string, public retryAfter?:string){super(message);} }
export class VimeoClient {
  private base:string; private token:string; private timeout:number; private retries:number;
  constructor(env=process.env){this.token=env.VIMEO_ACCESS_TOKEN??''; if(!this.token) throw new Error('VIMEO_ACCESS_TOKEN is required'); this.base=(env.VIMEO_API_BASE_URL??'https://api.vimeo.com').replace(/\/$/,''); this.timeout=Number(env.VIMEO_TIMEOUT_MS??15000); this.retries=Math.min(4,Math.max(0,Number(env.VIMEO_MAX_RETRIES??2)));}
  async request(path:string, method:HttpMethod='GET', body?:unknown):Promise<any>{
    if(!path.startsWith('/')) throw new Error('Provider path must be absolute');
    const attempts=method==='GET'?this.retries+1:1;
    for(let i=0;i<attempts;i++){
      const ctrl=new AbortController(); const timer=setTimeout(()=>ctrl.abort(),this.timeout);
      try{
        const r=await fetch(this.base+path,{method,signal:ctrl.signal,headers:{Authorization:`Bearer ${this.token}`,Accept:'application/vnd.vimeo.*+json;version=3.4','Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body)});
        const text=await r.text(); let data:any={}; try{data=text?JSON.parse(text):{};}catch{data={raw:text};}
        if(r.ok) return data;
        const retryAfter=r.headers.get('retry-after')??undefined;
        if(method==='GET'&&(r.status===429||r.status>=500)&&i+1<attempts){const wait=retryAfter?Math.min(10000,Number(retryAfter)*1000):250*2**i; await new Promise(x=>setTimeout(x,Number.isFinite(wait)?wait:500)); continue;}
        throw new VimeoError(r.status,data?.error??data?.message??`Vimeo API error ${r.status}`,retryAfter);
      } finally { clearTimeout(timer); }
    }
    throw new Error('Request exhausted');
  }
}
export function pageQuery(page=1,perPage=25){if(!Number.isInteger(page)||page<1)throw new Error('page must be >= 1');if(!Number.isInteger(perPage)||perPage<1||perPage>100)throw new Error('perPage must be 1..100');return `page=${page}&per_page=${perPage}`;}
