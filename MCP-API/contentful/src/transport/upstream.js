import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

export class ContentfulUpstream{
  constructor(config,{clientFactory,transportFactory}={}){
    this.config=config;
    this.clientFactory=clientFactory||(()=>new Client({name:"contentful-connector-upstream",version:"1.0.0"},{capabilities:{}}));
    this.transportFactory=transportFactory||((opts)=>new StdioClientTransport(opts));
    this.client=null;this.connecting=null;this.toolNames=null;
  }
  async connect(){
    if(this.client) return this.client;
    if(this.connecting) return this.connecting;
    this.connecting=(async()=>{
      const client=this.clientFactory();
      const transport=this.transportFactory({command:this.config.upstreamCommand,args:[],env:{...process.env,CONTENTFUL_MANAGEMENT_ACCESS_TOKEN:this.config.token,SPACE_ID:this.config.spaceId,ENVIRONMENT_ID:this.config.environmentId,CONTENTFUL_HOST:this.config.host,PROTECTED_ENVIRONMENTS:this.config.protectedEnvironments.join(","),NODE_ENV:"production"}});
      await client.connect(transport);this.client=client;return client;
    })().finally(()=>{this.connecting=null;});
    return this.connecting;
  }
  async listTools(){const client=await this.connect();const response=await this.withTimeout(()=>client.listTools());const tools=response?.tools||[];this.toolNames=new Set(tools.map(t=>t.name));return tools;}
  async callTool(name,args,{readOnly=false}={}){
    const client=await this.connect();
    if(!this.toolNames) await this.listTools();
    if(!this.toolNames.has(name)) throw new Error(`Official upstream tool is unavailable: ${name}`);
    let attempt=0;
    while(true){
      try{return await this.withTimeout(()=>client.callTool({name,arguments:args}));}
      catch(error){if(!readOnly||attempt>=this.config.readRetries||!isTransient(error)) throw error;await sleep(Math.min(250*(2**attempt),2000));attempt++;}
    }
  }
  async close(){const c=this.client;this.client=null;this.toolNames=null;if(c) await c.close();}
  async withTimeout(fn){let timer;try{return await Promise.race([fn(),new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error(`Contentful upstream MCP timed out after ${this.config.timeoutMs}ms`)),this.config.timeoutMs);timer.unref?.();})]);}finally{if(timer)clearTimeout(timer);}}
}
function isTransient(error){const text=String(error?.message||error||"").toLowerCase();return text.includes("429")||text.includes("rate limit")||text.includes("timeout")||text.includes("timed out")||text.includes("econnreset")||text.includes("503")||text.includes("502")||text.includes("504");}
function sleep(ms){return new Promise(r=>setTimeout(r,ms));}
