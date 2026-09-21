import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js';
import {StdioServerTransport} from '@modelcontextprotocol/sdk/server/stdio.js';
import {ApolloClient,tools} from './core.js';

const token=process.env.APOLLO_API_KEY;
if(!token) throw new Error('APOLLO_API_KEY is required for this local REST-backed MCP facade. For interactive OAuth, connect clients directly to https://mcp.apollo.io/mcp.');
const client=new ApolloClient(token,undefined,Number(process.env.APOLLO_TIMEOUT_MS||15000),Number(process.env.APOLLO_MAX_RETRIES||2));
const server=new McpServer({name:'apollo-safe-connector',version:'1.0.0'});
for(const spec of tools){
 server.tool(spec.name,`Apollo ${spec.risk} operation${spec.approval?' requiring approval':''}`,spec.schema as any,async(input:any)=>{
  try{const result=await client.call(spec,input);return {content:[{type:'text',text:JSON.stringify({untrustedProviderData:true,...result})}]};}
  catch(e:any){return {isError:true,content:[{type:'text',text:JSON.stringify({error:e.message,status:e.status})}]};}
 });
}
await server.connect(new StdioServerTransport());
