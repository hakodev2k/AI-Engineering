import type { Config } from "./config.js";
export class WorkableMcpError extends Error { constructor(message:string, public status?:number, public retryAfter?:string){super(message);} }
export class WorkableMcpClient {
  private id=1;
  constructor(private config:Config, private fetchImpl:typeof fetch=fetch){}
  private async post(body:unknown, retryable=true):Promise<any>{
    for(let attempt=0;;attempt++){
      const ac=new AbortController(); const timer=setTimeout(()=>ac.abort(),this.config.timeoutMs);
      try{
        const r=await this.fetchImpl("https://mcp.workable.com/mcp",{method:"POST",headers:{"content-type":"application/json","accept":"application/json","authorization":`Bearer ${this.config.token}`},body:JSON.stringify(body),signal:ac.signal});
        const retryAfter=r.headers.get("retry-after")||undefined;
        if((r.status===429||r.status>=500)&&retryable&&attempt<this.config.maxRetries){ const delay=retryAfter?Math.min(10000,Number(retryAfter)*1000):Math.min(10000,250*2**attempt); await new Promise(x=>setTimeout(x,Number.isFinite(delay)?delay:500)); continue; }
        const text=await r.text(); if(!r.ok) throw new WorkableMcpError(`Workable MCP HTTP ${r.status}: ${text.slice(0,500)}`,r.status,retryAfter);
        const json=text?JSON.parse(text):{}; if(json.error) throw new WorkableMcpError(json.error.message||"Workable MCP error"); return json.result;
      }catch(e){ if((e as Error).name==="AbortError") throw new WorkableMcpError("Workable MCP request timed out."); throw e; } finally{clearTimeout(timer);}
    }
  }
  async initialize(){ return this.post({jsonrpc:"2.0",id:this.id++,method:"initialize",params:{protocolVersion:"2025-03-26",capabilities:{},clientInfo:{name:"ai-engineering-workable-connector",version:"1.0.0"}}}); }
  async callTool(name:string,args:Record<string,unknown>,retryable=true){ return this.post({jsonrpc:"2.0",id:this.id++,method:"tools/call",params:{name,arguments:args}},retryable); }
}
