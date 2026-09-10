import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { loadConfig } from './config.js';
import { TemporalCloudClient } from './client.js';
import { toolDefinitions, executeTool } from './tools.js';

const config=loadConfig();
const client=new TemporalCloudClient(config);

async function verifyAccountBoundary(){
  if(!config.allowedAccountId) return;
  const account=await client.request('GET','/cloud/account');
  const actual=account?.account?.id || account?.id || account?.accountId;
  if(actual && actual!==config.allowedAccountId) throw new Error(`Connected Temporal Cloud account ${actual} does not match TEMPORAL_CLOUD_ALLOWED_ACCOUNT_ID`);
}

await verifyAccountBoundary();

const server=new Server({name:'temporal-cloud-safe-connector',version:'1.0.0'},{capabilities:{tools:{}}});
server.setRequestHandler(ListToolsRequestSchema,async()=>({tools:toolDefinitions}));
server.setRequestHandler(CallToolRequestSchema,async req=>{
  try{
    const result=await executeTool(config,client,req.params.name,req.params.arguments||{});
    return {content:[{type:'text',text:JSON.stringify(result)}]};
  }catch(error){
    const status=error?.status;
    const safe={error:error?.name||'ConnectorError',message:String(error?.message||error).slice(0,1000),status:status||undefined,retryAfterSeconds:error?.retryAfterSeconds};
    return {isError:true,content:[{type:'text',text:JSON.stringify(safe)}]};
  }
});
await server.connect(new StdioServerTransport());
