import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import type { AdyenConfig } from './config.js';
import type { Risk } from './policy.js';
import { TOOLS } from './tools.js';

const sleep=(ms:number)=>new Promise(r=>setTimeout(r,ms));
const transient=(e:unknown)=>/429|rate.?limit|timeout|timed out|temporar|ECONNRESET|EAI_AGAIN|502|503|504/i.test(e instanceof Error?e.message:String(e));

export class AdyenUpstream {
  private client?:Client;
  private transport?:StdioClientTransport;
  constructor(private readonly config:AdyenConfig){}
  private async connect(){
    if(this.client)return;
    const allowlist=TOOLS.map(t=>t.upstream).join(',');
    const args=['-y','@adyen/mcp','--env='+this.config.env,'--tools='+allowlist];
    if(this.config.env==='LIVE'&&this.config.livePrefix)args.push('--livePrefix='+this.config.livePrefix);
    this.transport=new StdioClientTransport({command:'npx',args,env:{...process.env,ADYEN_API_KEY:this.config.apiKey} as Record<string,string>});
    this.client=new Client({name:'adyen-safety-gateway',version:'1.0.0'},{capabilities:{}});
    await this.client.connect(this.transport);
  }
  async call(upstream:string,args:Record<string,unknown>,risk:Risk){
    const clean={...args};delete clean.approvalToken;
    if(upstream==='update_payment_link')clean.status='expired';
    const attempts=risk==='READ'?this.config.maxRetries+1:1;
    let last:unknown;
    for(let i=0;i<attempts;i++){
      try{
        await this.connect();
        const p=this.client!.callTool({name:upstream,arguments:clean});
        const timeout=new Promise<never>((_,reject)=>setTimeout(()=>reject(new Error('Adyen upstream MCP timeout.')),this.config.timeoutMs));
        return await Promise.race([p,timeout]);
      }catch(e){last=e;if(i+1>=attempts||!transient(e))break;await this.close();await sleep(Math.min(250*2**i,2000));}
    }
    throw last instanceof Error?last:new Error(String(last));
  }
  async close(){try{await this.client?.close();}finally{this.client=undefined;this.transport=undefined;}}
}
