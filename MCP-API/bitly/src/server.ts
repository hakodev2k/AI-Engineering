import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js';
import {StdioServerTransport} from '@modelcontextprotocol/sdk/server/stdio.js';
import {loadConfig} from './config.js';
import {BitlyClient} from './client.js';
import {registerTools} from './tools.js';

const cfg=loadConfig();
const server=new McpServer({name:'bitly-connector',version:'1.0.0'});
registerTools(server,new BitlyClient(cfg),{requireWriteApproval:cfg.requireWriteApproval,destructiveEnabled:cfg.destructiveEnabled});
await server.connect(new StdioServerTransport());
