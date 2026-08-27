import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

export const UPSTREAM_ALLOWLIST=new Set(["list_mounts","create_mount","delete_mount","list_secrets","write_secret","delete_secret","enable_pki","create_pki_issuer","list_pki_issuers","read_pki_issuer","create_pki_role","read_pki_role","list_pki_roles","delete_pki_role","issue_pki_certificate"]);

export class OfficialMcpTransport {
  constructor(config,tokens,{transportFactory}={}){this.config=config;this.tokens=tokens;this.transportFactory=transportFactory||((o)=>new StdioClientTransport(o));this.client=null;}
  async connect(){if(this.client)return this.client;const token=await this.tokens.getToken();const tr=this.transportFactory({command:this.config.mcpCommand,args:this.config.mcpArgs,env:{...process.env,VAULT_ADDR:this.config.vaultAddr,VAULT_TOKEN:token,...(this.config.namespace?{VAULT_NAMESPACE:this.config.namespace}:{})},stderr:"pipe"});const c=new Client({name:"ai-engineering-vault-connector",version:"1.0.0"},{capabilities:{}});await c.connect(tr);const listed=await c.listTools(),available=new Set((listed.tools||[]).map(x=>x.name));for(const x of UPSTREAM_ALLOWLIST){if(!available.has(x)){await c.close().catch(()=>{});throw new Error(`Official Vault MCP server is missing expected tool: ${x}`);}}this.client=c;return c;}
  async call(tool,args={}){if(!UPSTREAM_ALLOWLIST.has(tool))throw new Error(`Upstream MCP tool is not allowlisted: ${tool}`);const c=await this.connect();const r=await c.callTool({name:tool,arguments:args});if(r?.isError)throw new Error(r.content?.map(x=>x.text).filter(Boolean).join("\n")||`${tool} failed`);return r;}
}
