import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { BitwardenAuth } from './auth.js';
import { BitwardenClient } from './client.js';
import { tools } from './tools.js';

const api=process.env.BITWARDEN_API_URL??'https://api.bitwarden.com';
const identity=process.env.BITWARDEN_IDENTITY_URL??'https://identity.bitwarden.com';
const allowed=['https://api.bitwarden.com','https://api.bitwarden.eu'];
if(!allowed.includes(api)&&!process.env.BITWARDEN_ALLOW_SELF_HOSTED) throw new Error('Custom API URL requires BITWARDEN_ALLOW_SELF_HOSTED=1');
const auth=new BitwardenAuth({clientId:process.env.BITWARDEN_CLIENT_ID??'',clientSecret:process.env.BITWARDEN_CLIENT_SECRET??'',identityUrl:identity});
const client=new BitwardenClient(auth,api,Number(process.env.BITWARDEN_TIMEOUT_MS??10000));
const server=new McpServer({name:'bitwarden-organization',version:'1.0.0'});
for(const t of tools(client)) server.tool(t.name,t.description,(t.schema as any).shape,async(input:unknown)=>{
 const parsed=t.schema.parse(input); const data=await t.run(parsed);
 return {content:[{type:'text' as const,text:JSON.stringify({risk:t.risk,source:'bitwarden',untrusted:true,data})}]};
});
await server.connect(new StdioServerTransport());
