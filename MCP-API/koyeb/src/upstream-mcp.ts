import {Client} from '@modelcontextprotocol/sdk/client/index.js';
import {StdioClientTransport} from '@modelcontextprotocol/sdk/client/stdio.js';
import type {Config} from './config.js';
const ALLOWED=new Set(['list-apps','get-app','create-app','list-services','get-service','create-service','update-service','list-deployments','get-deployment','list-instances','get-instance']);
export class KoyebOfficialMcp{
  private client?:Client;
  constructor(private cfg:Config){}
  async start(){if(this.client)return; const client=new Client({name:'ai-engineering-koyeb-connector',version:'1.0.0'}); const transport=new StdioClientTransport({command:'npx',args:['-y','@koyeb/mcp-server'],env:{...process.env,KOYEB_TOKEN:this.cfg.token}}); await client.connect(transport); const listed=await client.listTools(); const unexpected=listed.tools.filter(t=>!ALLOWED.has(t.name)); if(unexpected.length) process.stderr.write(`Ignoring unexpected upstream tools: ${unexpected.map(x=>x.name).join(',')}\n`); this.client=client;}
  async call(name:string,args:Record<string,unknown>){if(!ALLOWED.has(name)) throw new Error('UPSTREAM_TOOL_NOT_ALLOWED'); await this.start(); return this.client!.callTool({name,arguments:args});}
}
