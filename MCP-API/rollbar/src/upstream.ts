import {Client} from '@modelcontextprotocol/sdk/client/index.js';
import {StdioClientTransport} from '@modelcontextprotocol/sdk/client/stdio.js';
import type {Config} from './config.js';
const ALLOWED=new Set(['list-projects','get-item-details','get-deployments','get-version','get-top-items','list-items','list-occurrences','get-replay','update-item']);
export class RollbarUpstream{private client:Client;private transport:StdioClientTransport;constructor(private cfg:Config){const env:Record<string,string>={PATH:process.env.PATH??'',ROLLBAR_API_BASE:cfg.ROLLBAR_API_BASE};if(cfg.ROLLBAR_ACCESS_TOKEN)env.ROLLBAR_ACCESS_TOKEN=cfg.ROLLBAR_ACCESS_TOKEN;if(cfg.ROLLBAR_ACCOUNT_ACCESS_TOKEN)env.ROLLBAR_ACCOUNT_ACCESS_TOKEN=cfg.ROLLBAR_ACCOUNT_ACCESS_TOKEN;this.transport=new StdioClientTransport({command:'npx',args:['-y',cfg.ROLLBAR_MCP_PACKAGE],env,stderr:'pipe'});this.client=new Client({name:'ai-engineering-rollbar-wrapper',version:'1.0.0'});}
async connect(){await this.client.connect(this.transport);const discovered=await this.client.listTools();const names=new Set(discovered.tools.map(t=>t.name));for(const n of ALLOWED)if(!names.has(n))throw new Error(`Official Rollbar MCP missing expected tool: ${n}`);for(const n of names)if(!ALLOWED.has(n))process.stderr.write(`Rollbar MCP tool ignored by allowlist: ${n}\n`);}
async call(name:string,args:Record<string,unknown>){if(!ALLOWED.has(name))throw new Error('Upstream MCP tool is not allowlisted');return this.client.callTool({name,arguments:args});}
async close(){await this.client.close();}}
