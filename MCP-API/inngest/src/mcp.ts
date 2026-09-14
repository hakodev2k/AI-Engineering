import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const ALLOWED=new Set(["fetch_account","list_envs","get_apps","get_app","list_functions","get_function","list_runs","get_run","get_run_trace","send_event","invoke_function","cancel_run","rerun"]);
export class InngestMcp {
  private client?:Client; private schemas?:Map<string,any>;
  available(){ return Boolean(process.env.INNGEST_API_KEY) && !/^false$/i.test(process.env.INNGEST_PREFER_MCP||"true"); }
  private async connect(){
    if(this.client)return;
    const key=process.env.INNGEST_API_KEY; if(!key) throw new Error("INNGEST_API_KEY is not configured.");
    const endpoint=process.env.INNGEST_MCP_URL||"https://api.inngest.com/mcp";
    if(endpoint!=="https://api.inngest.com/mcp") throw new Error("Refusing a non-official Cloud MCP endpoint.");
    const client=new Client({name:"inngest-reusable-connector",version:"1.0.0"});
    await client.connect(new StreamableHTTPClientTransport(new URL(endpoint),{requestInit:{headers:{Authorization:`Bearer ${key}`}}}));
    const listed=await client.listTools(); this.schemas=new Map(listed.tools.filter(t=>ALLOWED.has(t.name)).map(t=>[t.name,t.inputSchema])); this.client=client;
  }
  async call(tool:string,args:Record<string,unknown>):Promise<{handled:boolean,data?:unknown}>{
    if(!this.available()||!ALLOWED.has(tool))return{handled:false};
    try{
      await this.connect(); const schema=this.schemas?.get(tool); if(!schema)return{handled:false};
      const props=new Set(Object.keys(schema.properties||{})); if(Object.keys(args).some(k=>!props.has(k)))return{handled:false};
      const res=await this.client!.callTool({name:tool,arguments:args}); if(res.isError)throw new Error("upstream MCP error"); return{handled:true,data:res};
    }catch{return{handled:false};}
  }
}
