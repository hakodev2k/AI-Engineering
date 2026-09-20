import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { MailgunClient } from './client.js';
import { invoke, tools } from './tools.js';

const server = new McpServer({ name:'mailgun-connector', version:'1.0.0' });
const client = new MailgunClient();

for (const tool of tools) {
  server.tool(tool.name, tool.description, tool.schema as any, async (args:any) => {
    try {
      const data = await invoke(tool,args,client);
      return { content:[{ type:'text', text:JSON.stringify({ ok:true, data, untrustedProviderContent:true }) }] };
    } catch (error:any) {
      return { isError:true, content:[{ type:'text', text:JSON.stringify({ ok:false, error:error?.message ?? String(error) }) }] };
    }
  });
}

await server.connect(new StdioServerTransport());
