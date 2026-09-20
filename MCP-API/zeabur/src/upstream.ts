import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { requireToken } from "./security.js";

export type Upstream = { listTools(): Promise<{tools:Array<{name:string}>}>; callTool(input:{name:string;arguments?:Record<string,unknown>}): Promise<unknown>; close(): Promise<void> };

export async function connectUpstream(): Promise<Upstream> {
  const token = requireToken();
  const transport = new StdioClientTransport({command:"npx",args:["-y","@zeabur/mcp-server"],env:{...process.env,ZEABUR_TOKEN:token} as Record<string,string>});
  const client = new Client({name:"ai-engineering-zeabur",version:"1.0.0"});
  await client.connect(transport);
  return client as unknown as Upstream;
}

export async function resolveTool(upstream: Upstream, patterns: RegExp[]): Promise<string> {
  const {tools} = await upstream.listTools();
  for (const pattern of patterns) {
    const hit = tools.find(t => pattern.test(t.name));
    if (hit) return hit.name;
  }
  throw new Error(`Official Zeabur MCP does not expose the required capability; available tools: ${tools.map(t=>t.name).join(", ")}`);
}
