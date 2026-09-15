import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { loadConfig } from './config.js';
import { NtfyClient } from './client.js';
import { handlers } from './tools.js';

const c=loadConfig(); const h=handlers(new NtfyClient(c),c); const server=new McpServer({name:'ntfy-connector',version:'1.0.0'});
const out=(v:unknown)=>({content:[{type:'text' as const,text:JSON.stringify(v)}]});
const common={topic:z.string(),message:z.string(),title:z.string().optional(),priority:z.enum(['min','low','default','high','max']).optional(),tags:z.array(z.string()).optional(),click:z.string().url().optional(),approved:z.boolean().optional()};
server.tool('ntfy.message.publish','Publish a notification. WRITE; approval configurable.',common,async x=>out(await h.publish(x)));
server.tool('ntfy.message.publish_markdown','Publish a Markdown notification. WRITE; approval configurable.',common,async x=>out(await h.publishMarkdown(x)));
server.tool('ntfy.message.schedule','Schedule a notification using ntfy Delay semantics. WRITE; approval configurable.',{...common,delay:z.string()},async x=>out(await h.schedule(x)));
server.tool('ntfy.message.poll','Poll cached messages. READ.',{topic:z.string(),since:z.string().optional(),limit:z.number().int().min(1).max(100).default(20)},async x=>out(await h.poll(x)));
server.tool('ntfy.topic.health','Read server health. READ.',{},async()=>out(await h.health()));
server.tool('ntfy.topic.subscribe_url','Build a JSON/SSE subscription URL without exposing credentials. READ.',{topic:z.string(),format:z.enum(['json','sse']).default('sse')},async x=>out(await h.subscribeUrl(x)));
await server.connect(new StdioServerTransport());
