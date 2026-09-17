export class MercuryError extends Error { constructor(public status:number, message:string, public retryAfter?:number){super(message)} }
export class MercuryClient {
  constructor(private token:string, private baseUrl:string, private timeoutMs=15000) { if(!token) throw new Error('MERCURY_API_TOKEN is required'); if(!/^https:\/\//.test(baseUrl)) throw new Error('MERCURY_BASE_URL must use HTTPS'); }
  async request(path:string, init:RequestInit={}, retry=true):Promise<any>{
    if(!path.startsWith('/')) throw new Error('Path must be relative');
    const controller=new AbortController(); const timer=setTimeout(()=>controller.abort(),this.timeoutMs);
    try {
      const res=await fetch(`${this.baseUrl.replace(/\/$/,'')}${path}`,{...init,signal:controller.signal,headers:{accept:'application/json',authorization:`Bearer ${this.token}`,'content-type':'application/json',...(init.headers||{})}});
      if(res.status===429){ const ra=Number(res.headers.get('retry-after')||'1'); if(retry && (init.method||'GET')==='GET'){await new Promise(r=>setTimeout(r,Math.min(ra,5)*1000)); return this.request(path,init,false)} throw new MercuryError(429,'Mercury rate limit exceeded',ra); }
      if(res.status===401) throw new MercuryError(401,'Mercury authentication failed');
      if(res.status===403) throw new MercuryError(403,'Mercury permission denied');
      const text=await res.text(); let body:any={}; if(text){try{body=JSON.parse(text)}catch{body={raw:text}}}
      if(!res.ok) throw new MercuryError(res.status,body?.message||body?.error||`Mercury API error ${res.status}`);
      return body;
    } catch(e:any){ if(e?.name==='AbortError') throw new MercuryError(408,'Mercury request timed out'); throw e; } finally {clearTimeout(timer)}
  }
}
