#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { tools } from './tools.js';

export function createServer() {
  const server = new McpServer({ name:'kubernetes-connector', version:'1.0.0' });
  for (const tool of tools) {
    server.registerTool(tool.name, { description:`${tool.description} Risk=${tool.risk}.`, inputSchema:tool.schema }, async (raw:any)=> {
      try {
        const input = tool.schema.parse(raw);
        const result = await tool.run(input);
        return { content:[{type:'text',text:JSON.stringify({ok:true,data:result},null,2)}] };
      } catch (e:any) {
        const body={ok:false,error:{code:e?.code ?? (e?.name==='ZodError'?'VALIDATION_ERROR':'INTERNAL_ERROR'),message:e?.message ?? String(e),status:e?.status,retryAfter:e?.retryAfter}};
        return { isError:true, content:[{type:'text',text:JSON.stringify(body,null,2)}] };
      }
    });
  }
  return server;
}

if (process.env.NODE_ENV !== 'test') {
  const server=createServer();
  await server.connect(new StdioServerTransport());
}
