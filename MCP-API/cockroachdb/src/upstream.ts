import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import type { Config } from "./config.js";
export interface UpstreamClient{listTools():Promise<{tools:Array<{name:string;description?:string;inputSchema:Record<string,unknown>}>}>;callTool(req:{name:string;arguments?:Record<string,unknown>}):Promise<unknown>;close():Promise<void>}
export async function createOfficialClient(cfg:Config):Promise<UpstreamClient>{
 const transport=new StreamableHTTPClientTransport(new URL("https://cockroachlabs.cloud/mcp"),{requestInit:{headers:{Authorization:`Bearer ${cfg.apiKey}`,"mcp-cluster-id":cfg.clusterId}}});
 const client=new Client({name:"ai-engineering-cockroachdb-connector",version:"1.0.0"});
 await client.connect(transport);
 return{listTools:()=>client.listTools() as any,callTool:r=>client.callTool(r),close:()=>client.close()};
}
export async function withTimeout<T>(p:Promise<T>,ms:number):Promise<T>{let timer:NodeJS.Timeout|undefined;try{return await Promise.race([p,new Promise<T>((_,rej)=>{timer=setTimeout(()=>rej(new Error(`CockroachDB MCP call timed out after ${ms}ms`)),ms)})])}finally{if(timer)clearTimeout(timer)}}
