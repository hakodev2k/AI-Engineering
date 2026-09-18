import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

export type Risk='READ'|'WRITE'|'HIGH_RISK'|'DESTRUCTIVE';
export class ApprovalError extends Error {}
export class AkeylessError extends Error { constructor(public status:number, message:string, public retryAfter?:number){super(message)} }

export class ApprovalGate {
  constructor(private token=process.env.AKEYLESS_APPROVAL_TOKEN||''){}
  require(risk:Risk, supplied?:string){ if((risk==='HIGH_RISK'||risk==='DESTRUCTIVE') && (!this.token||supplied!==this.token)) throw new ApprovalError(`Explicit approval required for ${risk}`); }
}

export class AkeylessClient {
  private token?:string;
  private base:string;
  private timeout:number;
  private retries:number;
  constructor(private fetcher:typeof fetch=fetch){
    this.base=(process.env.AKEYLESS_API_URL||'https://api.akeyless.io').replace(/\/$/,'');
    if(!/^https:\/\//.test(this.base)) throw new Error('AKEYLESS_API_URL must use HTTPS');
    this.timeout=Number(process.env.AKEYLESS_TIMEOUT_MS||15000); this.retries=Number(process.env.AKEYLESS_MAX_RETRIES||2);
  }
  private async request(path:string, body:Record<string,unknown>, authenticated=true, retryable=true):Promise<any>{
    if(authenticated&&!this.token) await this.authenticate();
    const payload=authenticated?{...body,token:this.token}:body;
    for(let attempt=0;;attempt++){
      const c=new AbortController(); const t=setTimeout(()=>c.abort(),this.timeout);
      try{
        const r=await this.fetcher(`${this.base}/api/v2/${path}`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload),signal:c.signal});
        const text=await r.text(); let data:any={}; try{data=text?JSON.parse(text):{}}catch{data={message:text}}
        if(r.ok) return data;
        const ra=Number(r.headers.get('retry-after')||0);
        if((r.status===429||r.status>=500)&&retryable&&attempt<this.retries){await new Promise(x=>setTimeout(x,Math.max(ra*1000,250*2**attempt)));continue}
        throw new AkeylessError(r.status,data.message||data.error||`Akeyless HTTP ${r.status}`,ra||undefined);
      } finally {clearTimeout(t)}
    }
  }
  async authenticate(){const id=process.env.AKEYLESS_ACCESS_ID,key=process.env.AKEYLESS_ACCESS_KEY;if(!id||!key)throw new Error('AKEYLESS_ACCESS_ID and AKEYLESS_ACCESS_KEY are required');const x=await this.request('auth',{access_type:'access_key',access_id:id,access_key:key},false,false);if(!x.token)throw new Error('Akeyless authentication returned no token');this.token=x.token;return {authenticated:true};}
  list(path='/',paginationToken?:string){return this.request('list-items',{path,'pagination-token':paginationToken||'', 'show-versions':false});}
  get(name:string){return this.request('get-secret-value',{names:[name]});}
  create(name:string,value:string){return this.request('create-secret',{name,value},true,false);}
  update(name:string,value:string){return this.request('update-secret-val',{name,value},true,false);}
  delete(name:string){return this.request('delete-item',{name},true,false);}
}

const safeName=z.string().min(1).max(512).regex(/^\/[A-Za-z0-9._\/-]+$/,'absolute Akeyless path required');
const approval=z.string().min(8).optional();
const client=new AkeylessClient(); const gate=new ApprovalGate(); const server=new McpServer({name:'akeyless-connector',version:'1.0.0'});
const out=(x:unknown)=>({content:[{type:'text' as const,text:JSON.stringify(x)}]});
const err=(e:unknown)=>({content:[{type:'text' as const,text:JSON.stringify({error:e instanceof Error?e.message:'unknown error'})}],isError:true});

server.tool('akeyless.auth.validate','Validate configured connector credentials without returning them.',{},async()=>{try{return out(await client.authenticate())}catch(e){return err(e)}});
server.tool('akeyless.secret.list','List secret items under an Akeyless path. READ.',{path:safeName.default('/'),paginationToken:z.string().max(2048).optional()},async a=>{try{return out(await client.list(a.path,a.paginationToken))}catch(e){return err(e)}});
server.tool('akeyless.secret.metadata','Read a secret response with secret values removed. READ.',{name:safeName},async a=>{try{const x=await client.get(a.name);const scrub=(v:any):any=>Array.isArray(v)?v.map(scrub):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).filter(([k])=>!/(value|secret|password|token)/i.test(k)).map(([k,v])=>[k,scrub(v)])):v;return out(scrub(x))}catch(e){return err(e)}});
server.tool('akeyless.secret.read_redacted','Confirm a secret exists and return only redacted structural information. READ.',{name:safeName},async a=>{try{const x=await client.get(a.name);return out({name:a.name,exists:true,redacted:true,keys:x&&typeof x==='object'?Object.keys(x):[]})}catch(e){return err(e)}});
server.tool('akeyless.secret.reveal','Reveal a secret value. HIGH_RISK; explicit approval required.',{name:safeName,approvalToken:approval},async a=>{try{gate.require('HIGH_RISK',a.approvalToken);return out(await client.get(a.name))}catch(e){return err(e)}});
server.tool('akeyless.secret.create','Create a static secret. WRITE.',{name:safeName,value:z.string().min(1).max(65536)},async a=>{try{return out(await client.create(a.name,a.value))}catch(e){return err(e)}});
server.tool('akeyless.secret.update','Replace a static secret value. WRITE.',{name:safeName,value:z.string().min(1).max(65536)},async a=>{try{return out(await client.update(a.name,a.value))}catch(e){return err(e)}});
server.tool('akeyless.secret.delete','Delete a secret. DESTRUCTIVE; explicit approval required.',{name:safeName,approvalToken:approval},async a=>{try{gate.require('DESTRUCTIVE',a.approvalToken);return out(await client.delete(a.name))}catch(e){return err(e)}});

if(process.env.NODE_ENV!=='test') await server.connect(new StdioServerTransport());
export {server,safeName};
