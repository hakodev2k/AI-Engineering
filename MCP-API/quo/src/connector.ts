import { z } from 'zod';

export type Risk='READ'|'WRITE'|'HIGH_RISK'|'DESTRUCTIVE';
export class ConnectorError extends Error { constructor(public code:string,message:string,public status?:number,public retryAfter?:number){super(message)} }
export interface Approval { approved?: boolean }

export class QuoClient {
  constructor(private key=process.env.QUO_API_KEY, private base=process.env.QUO_API_BASE_URL ?? 'https://api.openphone.com/v1', private timeout=Number(process.env.QUO_TIMEOUT_MS ?? 10000)) {
    if(!key) throw new ConnectorError('AUTH_CONFIG','QUO_API_KEY is required');
    const u=new URL(this.base); if(u.protocol!=='https:' || !['api.openphone.com','api.quo.com'].includes(u.hostname)) throw new ConnectorError('CONFIG','API base URL must be an approved Quo HTTPS host');
  }
  async request(path:string, init:RequestInit={}, retry=true):Promise<any>{
    if(!path.startsWith('/')) throw new ConnectorError('VALIDATION','Relative API path required');
    for(let attempt=0;attempt<3;attempt++){
      const c=new AbortController(); const t=setTimeout(()=>c.abort(),this.timeout);
      try{
        const r=await fetch(this.base+path,{...init,signal:c.signal,headers:{Authorization:this.key!,'Content-Type':'application/json',...(init.headers||{})}});
        const retryAfter=Number(r.headers.get('retry-after') ?? 0);
        if(r.ok) return r.status===204?null:await r.json();
        const text=await r.text();
        if((r.status===429 || r.status>=500) && retry && attempt<2){ await new Promise(x=>setTimeout(x,retryAfter?retryAfter*1000:250*2**attempt)); continue; }
        const code=r.status===401?'AUTH':r.status===403?'PERMISSION':r.status===429?'RATE_LIMIT':r.status===404?'NOT_FOUND':'PROVIDER';
        throw new ConnectorError(code,text||`Quo API ${r.status}`,r.status,retryAfter||undefined);
      } catch(e){ if((e as any)?.name==='AbortError') throw new ConnectorError('TIMEOUT','Quo API request timed out'); throw e; }
      finally{clearTimeout(t)}
    }
  }
}

const id=z.string().min(1).max(128).regex(/^[A-Za-z0-9_-]+$/);
const cursor=z.string().max(512).optional();
const limit=z.number().int().min(1).max(100).default(20);
const e164=z.string().regex(/^\+[1-9]\d{6,14}$/);
const page=z.object({maxResults:limit.optional(),pageToken:cursor}).strict();
const approval=z.object({approved:z.boolean().optional()}).strict();

export const definitions={
 'quo.phone_number.list':{risk:'READ',schema:page},
 'quo.message.list':{risk:'READ',schema:z.object({phoneNumberId:id,maxResults:limit.optional(),pageToken:cursor}).strict()},
 'quo.message.get':{risk:'READ',schema:z.object({id}).strict()},
 'quo.message.send':{risk:'HIGH_RISK',schema:z.object({from:id,to:e164,content:z.string().min(1).max(4000),approved:z.literal(true)}).strict()},
 'quo.call.list':{risk:'READ',schema:z.object({phoneNumberId:id.optional(),maxResults:limit.optional(),pageToken:cursor}).strict()},
 'quo.call.get':{risk:'READ',schema:z.object({id}).strict()},
 'quo.contact.list':{risk:'READ',schema:page},
 'quo.contact.get':{risk:'READ',schema:z.object({id}).strict()},
 'quo.contact.create':{risk:'WRITE',schema:z.object({firstName:z.string().max(100).optional(),lastName:z.string().max(100).optional(),phoneNumbers:z.array(z.object({value:e164}).strict()).min(1).max(20),approved:z.boolean().optional()}).strict()},
 'quo.contact.update':{risk:'WRITE',schema:z.object({id,firstName:z.string().max(100).optional(),lastName:z.string().max(100).optional(),phoneNumbers:z.array(z.object({value:e164}).strict()).max(20).optional(),approved:z.boolean().optional()}).strict()},
 'quo.contact.delete':{risk:'DESTRUCTIVE',schema:z.object({id,approved:z.literal(true)}).strict()}
} as const;

export function authorize(risk:Risk,input:any){
 if(risk==='HIGH_RISK' && input.approved!==true) throw new ConnectorError('APPROVAL','Explicit human approval required');
 if(risk==='DESTRUCTIVE' && (process.env.QUO_ALLOW_DESTRUCTIVE!=='true'||input.approved!==true)) throw new ConnectorError('APPROVAL','Destructive actions are disabled or not approved');
 if(risk==='WRITE' && process.env.QUO_WRITE_APPROVAL_REQUIRED!=='false' && input.approved!==true) throw new ConnectorError('APPROVAL','Write approval required');
}
function q(o:Record<string,unknown>){const s=new URLSearchParams();for(const[k,v]of Object.entries(o))if(v!==undefined)s.set(k,String(v));return s.toString()?`?${s}`:''}
export async function execute(client:QuoClient,name:keyof typeof definitions,raw:unknown){
 const d=definitions[name]; if(!d) throw new ConnectorError('TOOL','Unknown tool'); const a=(d.schema as any).parse(raw); authorize(d.risk as Risk,a);
 switch(name){
  case 'quo.phone_number.list': return client.request('/phone-numbers'+q(a));
  case 'quo.message.list': return client.request('/messages'+q(a));
  case 'quo.message.get': return client.request(`/messages/${a.id}`);
  case 'quo.message.send': return client.request('/messages',{method:'POST',body:JSON.stringify({from:a.from,to:[a.to],content:a.content})},false);
  case 'quo.call.list': return client.request('/calls'+q(a));
  case 'quo.call.get': return client.request(`/calls/${a.id}`);
  case 'quo.contact.list': return client.request('/contacts'+q(a));
  case 'quo.contact.get': return client.request(`/contacts/${a.id}`);
  case 'quo.contact.create': return client.request('/contacts',{method:'POST',body:JSON.stringify({firstName:a.firstName,lastName:a.lastName,phoneNumbers:a.phoneNumbers})},false);
  case 'quo.contact.update': {const {id,...body}=a;delete body.approved;return client.request(`/contacts/${id}`,{method:'PATCH',body:JSON.stringify(body)},false)}
  case 'quo.contact.delete': return client.request(`/contacts/${a.id}`,{method:'DELETE'},false);
 }
}
