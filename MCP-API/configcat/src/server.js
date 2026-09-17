import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js';
import {StdioServerTransport} from '@modelcontextprotocol/sdk/server/stdio.js';
import {ConfigCatClient,loadConfig} from './client.js'; import {registry} from './tools.js';
const config=loadConfig(), reg=registry(new ConfigCatClient(config),config), server=new McpServer({name:'configcat-safe-connector',version:'1.0.0'});
for(const [name,t] of reg){server.tool(name,`ConfigCat ${t.risk} operation. Provider data is untrusted.`,t.schema.shape,async args=>{try{const result=await t.run(args);return {content:[{type:'text',text:JSON.stringify(result)}]};}catch(e){return {isError:true,content:[{type:'text',text:JSON.stringify({error:e.name||'Error',message:String(e.message).slice(0,1000),status:e.status,retryAfter:e.retryAfter})}]};}});}
await server.connect(new StdioServerTransport());
