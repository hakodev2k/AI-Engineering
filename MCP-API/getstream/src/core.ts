import { StreamChat } from 'stream-chat';

export type Risk='READ'|'WRITE'|'HIGH_RISK'|'DESTRUCTIVE';
export class ApprovalError extends Error {}
export interface Config { apiKey:string; apiSecret:string; allowWrites:boolean; timeoutMs:number; maxRetries:number }
export function loadConfig(env=process.env):Config {
  const apiKey=env.GETSTREAM_API_KEY?.trim()||''; const apiSecret=env.GETSTREAM_API_SECRET?.trim()||'';
  if(!apiKey||!apiSecret) throw new Error('GETSTREAM_API_KEY and GETSTREAM_API_SECRET are required');
  return {apiKey,apiSecret,allowWrites:env.GETSTREAM_ALLOW_WRITES==='true',timeoutMs:Number(env.GETSTREAM_TIMEOUT_MS||10000),maxRetries:Number(env.GETSTREAM_MAX_RETRIES||2)};
}
export function requireApproval(config:Config, approved:boolean|undefined, risk:Risk){
  if(risk==='READ') return;
  if(!config.allowWrites) throw new ApprovalError('Write tools are disabled; set GETSTREAM_ALLOW_WRITES=true');
  if(!approved) throw new ApprovalError('Explicit human approval is required');
}
export class GetStreamClient {
  readonly chat:StreamChat;
  constructor(readonly config:Config){ this.chat=StreamChat.getInstance(config.apiKey,config.apiSecret,{timeout:config.timeoutMs}); }
  async retry<T>(fn:()=>Promise<T>, safe=true):Promise<T>{
    let last:unknown; const attempts=safe?configInt(this.config.maxRetries)+1:1;
    for(let i=0;i<attempts;i++) try{return await fn();}catch(e:any){last=e; const s=e?.response?.status||e?.status; if(!safe||[400,401,403,404].includes(s)) throw e; if(s===429){const ms=Number(e?.response?.headers?.['retry-after']||1)*1000; await sleep(Math.min(ms,5000));} else if(i<attempts-1) await sleep(Math.min(250*2**i,2000));}
    throw last;
  }
  queryUsers(filter:Record<string,unknown>,limit=25,offset=0){return this.retry(()=>this.chat.queryUsers(filter,{id:1},{limit,offset}));}
  queryChannels(filter:Record<string,unknown>,limit=20,offset=0){return this.retry(()=>this.chat.queryChannels(filter,{last_message_at:-1},{limit,offset,state:true,watch:false}));}
  search(channelFilter:Record<string,unknown>,query:string,limit=20,offset=0){return this.retry(()=>this.chat.search(channelFilter,query,{limit,offset}));}
  getMessage(id:string){return this.retry(()=>this.chat.getMessage(id));}
  async sendMessage(type:string,id:string,userId:string,text:string){return this.retry(()=>this.chat.channel(type,id).sendMessage({text,user_id:userId}),false);}
  async updateMessage(id:string,userId:string,text:string){return this.retry(()=>this.chat.updateMessage({id,text,user_id:userId}),false);}
  async deleteMessage(id:string,hard=false){return this.retry(()=>this.chat.deleteMessage(id,hard),false);}
  async banUser(targetUserId:string,options:{reason?:string;timeout?:number}={}){return this.retry(()=>this.chat.banUser(targetUserId,options),false);}
}
const sleep=(ms:number)=>new Promise(r=>setTimeout(r,ms)); const configInt=(n:number)=>Number.isFinite(n)&&n>=0?Math.min(Math.floor(n),5):2;
