export class PirschError extends Error { constructor(message:string, public status?:number, public retryAfter?:number){super(message)} }
export class PirschClient {
  private token?:{value:string;expires:number};
  constructor(private env=process.env, private fetcher:typeof fetch=fetch){}
  private base(){return (this.env.PIRSCH_API_BASE_URL||'https://api.pirsch.io').replace(/\/$/,'')}
  private async auth(write=false){
    if(write&&this.env.PIRSCH_ACCESS_KEY) return this.env.PIRSCH_ACCESS_KEY;
    if(this.token&&Date.now()<this.token.expires-60000)return this.token.value;
    if(!this.env.PIRSCH_CLIENT_ID||!this.env.PIRSCH_CLIENT_SECRET)throw new PirschError('Missing Pirsch OAuth client credentials',401);
    const r=await this.fetcher(`${this.base()}/api/v1/token`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({client_id:this.env.PIRSCH_CLIENT_ID,client_secret:this.env.PIRSCH_CLIENT_SECRET})});
    if(!r.ok)throw new PirschError('Pirsch authentication failed',r.status);
    const j:any=await r.json(); this.token={value:j.access_token,expires:Date.parse(j.expires_at)}; return this.token.value;
  }
  async request(path:string, init:RequestInit={}, write=false){
    const timeout=Number(this.env.PIRSCH_TIMEOUT_MS||15000); const ac=new AbortController(); const timer=setTimeout(()=>ac.abort(),timeout);
    try { for(let attempt=0;attempt<3;attempt++){
      const token=await this.auth(write); const r=await this.fetcher(`${this.base()}${path}`,{...init,signal:ac.signal,headers:{accept:'application/json',authorization:`Bearer ${token}`,...init.headers}});
      if(r.ok){const text=await r.text();return text?JSON.parse(text):{};}
      const retryAfter=Number(r.headers.get('retry-after')||0); if((r.status===429||r.status>=500)&&attempt<2){await new Promise(x=>setTimeout(x,retryAfter?retryAfter*1000:250*2**attempt));continue;}
      let detail='';try{detail=await r.text()}catch{} throw new PirschError(`Pirsch API error ${r.status}${detail?`: ${detail.slice(0,500)}`:''}`,r.status,retryAfter||undefined);
    }} finally {clearTimeout(timer)}
  }
  get(path:string){return this.request(path)}
  post(path:string,body:unknown){return this.request(path,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)},true)}
}
