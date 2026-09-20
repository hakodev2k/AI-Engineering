import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js'; import {StdioServerTransport} from '@modelcontextprotocol/sdk/server/stdio.js'; import {LaunchDarklyClient} from './client.js'; import {tools,invoke} from './tools.js';
export function buildServer(client=new LaunchDarklyClient()){
 const server=new McpServer({name:'launchdarkly-connector',version:'1.0.0'});
 for(const d of tools) server.tool(d.name,d.description,d.schema,async(input:any)=>{try{const data=await invoke(d,client,input);return{content:[{type:'text',text:JSON.stringify({provider:'launchdarkly',untrustedProviderData:true,data})}]};}catch(e:any){return{isError:true,content:[{type:'text',text:JSON.stringify({error:e?.name??'Error',message:e?.message??String(e)})}]};}});
 return server;
}
if(process.env.NODE_ENV!=='test'){const server=buildServer();await server.connect(new StdioServerTransport());}
