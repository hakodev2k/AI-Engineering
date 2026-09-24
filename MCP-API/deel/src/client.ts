import {Client} from '@modelcontextprotocol/sdk/client/index.js';
import {StreamableHTTPClientTransport} from '@modelcontextprotocol/sdk/client/streamableHttp.js';
export class DeelClient{
 private client?:Client; private last=0;
 constructor(private env:NodeJS.ProcessEnv=process.env){const u=env.DEEL_MCP_URL||'https://api.letsdeel.com/mcp';if(u!=='https://api.letsdeel.com/mcp')throw new Error('DEEL_MCP_URL must be the official Deel MCP endpoint');if(!env.DEEL_ACCESS_TOKEN)throw new Error('DEEL_ACCESS_TOKEN is required');}
 async connect(){if(this.client)return this.client;const c=new Client({name:'deel-connector',version:'1.0.0'});const t=new StreamableHTTPClientTransport(new URL('https://api.letsdeel.com/mcp'),{requestInit:{headers:{Authorization:`Bearer ${this.env.DEEL_ACCESS_TOKEN}`}}});await c.connect(t);this.client=c;return c;}
 private async pace(){const wait=210-(Date.now()-this.last);if(wait>0)await new Promise(r=>setTimeout(r,wait));this.last=Date.now();}
 async call(name:string,args:Record<string,unknown>,safeRead=true){await this.pace();const c=await this.connect();const max=safeRead?Math.min(5,Math.max(0,Number(this.env.DEEL_MAX_READ_RETRIES||2))):0;for(let i=0;;i++){try{const r=await c.callTool({name,arguments:args});if(r.isError)throw new Error(`Deel tool failed: ${JSON.stringify(r.content)}`);return r;}catch(e){const m=String(e);if(i>=max||/401|403|invalid params|not found/i.test(m))throw e;await new Promise(r=>setTimeout(r,Math.min(4000,1000*2**i)));}}}
 async verifyTools(required:string[]){const c=await this.connect();const listed=await c.listTools();const names=new Set(listed.tools.map(t=>t.name));const missing=required.filter(x=>!names.has(x));if(missing.length)throw new Error(`Official Deel MCP missing allowlisted tools: ${missing.join(', ')}`);}
}