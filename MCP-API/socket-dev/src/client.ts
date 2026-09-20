export class SocketError extends Error { constructor(public status:number, message:string, public retryAfter?:number){super(message)} }
export type RequestOptions={method?:'GET'|'POST';query?:Record<string,string|number|boolean|undefined>;body?:unknown;approval?:boolean};
export class SocketClient {
  constructor(private token:string, private base='https://api.socket.dev/v0', private timeout=20000, private writes=false){if(!token) throw new Error('SOCKET_API_TOKEN is required');}
  private async request(path:string,o:RequestOptions={}){if(o.method==='POST' && !(o.approval&&this.writes)) throw new SocketError(403,'Explicit write approval required'); const u=new URL(this.base.replace(/\/$/,'')+path); for(const [k,v] of Object.entries(o.query??{})) if(v!==undefined)u.searchParams.set(k,String(v)); const ctl=new AbortController(); const t=setTimeout(()=>ctl.abort(),this.timeout); try{const r=await fetch(u,{method:o.method??'GET',headers:{authorization:`Bearer ${this.token}`,accept:'application/json',...(o.body?{'content-type':'application/json'}:{})},body:o.body?JSON.stringify(o.body):undefined,signal:ctl.signal}); const text=await r.text(); let data:any; try{data=text?JSON.parse(text):null}catch{data={raw:text}} if(!r.ok){const ra=Number(r.headers.get('retry-after')||0)||undefined; throw new SocketError(r.status,data?.message||data?.error||`Socket API ${r.status}`,ra)} return data;}catch(e:any){if(e?.name==='AbortError')throw new SocketError(408,'Socket API request timed out'); throw e}finally{clearTimeout(t)}}
  quota(){return this.request('/quota')}
  organizations(){return this.request('/organizations')}
  alerts(org:string,q:Record<string,any>={}){return this.request(`/orgs/${encodeURIComponent(org)}/alerts`,{query:q})}
  repositories(org:string,q:Record<string,any>={}){return this.request(`/orgs/${encodeURIComponent(org)}/repos`,{query:q})}
  fullScans(org:string,q:Record<string,any>={}){return this.request(`/orgs/${encodeURIComponent(org)}/full-scans`,{query:q})}
  fullScan(org:string,id:string){return this.request(`/orgs/${encodeURIComponent(org)}/full-scans/${encodeURIComponent(id)}`,{query:{include_scores:true}})}
  inspectPackage(org:string,purl:string){return this.request(`/orgs/${encodeURIComponent(org)}/purl`,{method:'POST',body:{components:[{purl}]},approval:true})}
  createFullScan(org:string,repo:string,body:unknown,approval:boolean){return this.request(`/orgs/${encodeURIComponent(org)}/full-scans`,{method:'POST',query:{repo},body,approval})}
}
export function fromEnv(){return new SocketClient(process.env.SOCKET_API_TOKEN||'',process.env.SOCKET_API_BASE_URL,Number(process.env.SOCKET_TIMEOUT_MS||20000),process.env.SOCKET_APPROVE_WRITES==='true')}
