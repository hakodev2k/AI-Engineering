export class PagerTreeError extends Error { constructor(public status:number, message:string, public retryAfter?:string){super(message)} }
export class PagerTreeClient {
  constructor(private token:string, private base='https://api.pagertree.com/api/v4', private timeout=15000, private fetcher:typeof fetch=fetch){if(!token) throw new Error('PAGERTREE_API_KEY is required'); if(!base.startsWith('https://')) throw new Error('PAGERTREE_BASE_URL must use HTTPS');}
  async request(path:string, init:RequestInit={}, retry=true):Promise<unknown>{
    const url=new URL(path.replace(/^\//,''),this.base.replace(/\/$/,'')+'/');
    if(url.origin!==new URL(this.base).origin) throw new Error('Cross-origin request blocked');
    for(let attempt=0;attempt<(retry?3:1);attempt++){
      const c=new AbortController(); const t=setTimeout(()=>c.abort(),this.timeout);
      try{const r=await this.fetcher(url,{...init,signal:c.signal,headers:{Accept:'application/json',Authorization:`Bearer ${this.token}`,'Content-Type':'application/json',...(init.headers||{})}}); const text=await r.text(); let body:unknown; try{body=text?JSON.parse(text):{};}catch{body={message:text};}
        if(r.ok)return body; const ra=r.headers.get('retry-after')||undefined; if((r.status===429||r.status>=500)&&attempt<2){await new Promise(x=>setTimeout(x,ra?Math.min(Number(ra)*1000,10000):250*2**attempt));continue;} throw new PagerTreeError(r.status,`PagerTree API ${r.status}: ${text.slice(0,500)}`,ra);
      } finally {clearTimeout(t)}
    } throw new Error('PagerTree request failed');
  }
}