import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
export class ZapierUpstream {
 constructor(config){this.config=config;this.client=null;}
 async connect(){const c=new Client({name:'zapier-safe-connector',version:'1.0.0'});await c.connect(new StreamableHTTPClientTransport(new URL(this.config.endpoint)));this.client=c;}
 async listTools(){if(!this.client)await this.connect();const r=await this.client.listTools();return r.tools.filter(t=>this.config.allowedTools.has(t.name));}
 async callTool(name,args,signal){if(!this.config.allowedTools.has(name))throw new Error(`Upstream tool is not allowlisted: ${name}`);if(!this.client)await this.connect();return this.client.callTool({name,arguments:args},undefined,{signal});}
 async close(){if(this.client)await this.client.close();}
}
