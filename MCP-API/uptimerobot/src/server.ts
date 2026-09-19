import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'; import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'; import { UptimeRobotClient } from './client.js'; import { tools } from './tools.js';
const key=process.env.UPTIMEROBOT_API_KEY||''; const base=process.env.UPTIMEROBOT_API_BASE_URL||'https://api.uptimerobot.com/v3'; const timeout=Number(process.env.UPTIMEROBOT_TIMEOUT_MS||15000);
const policy={writeApproval:(process.env.UPTIMEROBOT_WRITE_APPROVAL||'required')!=='optional',destructiveEnabled:process.env.UPTIMEROBOT_DESTRUCTIVE_ENABLED==='true'};
const server=new McpServer({name:'uptimerobot-connector',version:'1.0.0'}); const client=new UptimeRobotClient(key,base,timeout);
for(const t of tools(client,policy)) server.tool(t.name,t.description,(t.schema as any).shape,async(args:any)=>{try{const data=await t.run(args);return {content:[{type:'text',text:JSON.stringify({ok:true,data,untrustedProviderContent:true})}]};}catch(e){return {isError:true,content:[{type:'text',text:JSON.stringify({ok:false,error:(e as any).code||'CONNECTOR_ERROR',message:(e as Error).message})}]};}});
await server.connect(new StdioServerTransport());
