import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js';
import {StdioServerTransport} from '@modelcontextprotocol/sdk/server/stdio.js';
import {z} from 'zod';
import {clientFromEnv} from './client.js';
import {buildTools,executeTool} from './tools.js';
export function createServer(){const server=new McpServer({name:'fusionauth-connector',version:'1.0.0'});for(const t of buildTools(clientFromEnv()))server.tool(t.name,t.description,{input:z.record(z.unknown()).default({}),approved:z.boolean().default(false)},async({input,approved})=>{try{const result=await executeTool(t,input,approved);return{content:[{type:'text',text:JSON.stringify({risk:t.risk,untrustedProviderData:true,result})}]}}catch(e:any){return{isError:true,content:[{type:'text',text:JSON.stringify({error:e?.message??'Unknown error',risk:t.risk})}]}}});return server}
if(import.meta.url===`file://${process.argv[1]}`){const s=createServer();await s.connect(new StdioServerTransport())}
