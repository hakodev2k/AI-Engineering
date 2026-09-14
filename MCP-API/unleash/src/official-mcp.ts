import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
const ALLOWED=new Set(["list_projects","list_flags","get_flag_state","create_flag","toggle_flag_environment","remove_flag_strategy"]);
export class OfficialMcpBridge {
  private client?:Client; private schemas=new Map<string,any>();
  enabled(){return !/^false$/i.test(process.env.UNLEASH_PREFER_OFFICIAL_MCP||"true")&&Boolean(process.env.UNLEASH_BASE_URL&&process.env.UNLEASH_PAT);}
  private async connect(){ if(this.client)return; const env={...process.env,UNLEASH_BASE_URL:process.env.UNLEASH_BASE_URL!,UNLEASH_PAT:process.env.UNLEASH_PAT!,UNLEASH_DEFAULT_PROJECT:process.env.UNLEASH_DEFAULT_PROJECT||"default"}; const tr=new StdioClientTransport({command:"npx",args:["-y","@unleash/mcp@latest","--log-level","error"],env:env as Record<string,string>}); const c=new Client({name:"unleash-reusable-connector",version:"1.0.0"}); await c.connect(tr); const listed=await c.listTools(); for(const t of listed.tools) if(ALLOWED.has(t.name))this.schemas.set(t.name,t.inputSchema); this.client=c; }
  async call(name:string,args:Record<string,unknown>){ if(!this.enabled()||!ALLOWED.has(name))return {handled:false}; try{ await this.connect(); const schema=this.schemas.get(name); if(!schema)return {handled:false}; const props=new Set(Object.keys(schema.properties||{})); if(Object.keys(args).some(k=>!props.has(k)))return {handled:false}; const r=await this.client!.callTool({name,arguments:args}); if(r.isError)throw new Error("upstream MCP error"); return {handled:true,data:r}; }catch{return {handled:false};} }
}
