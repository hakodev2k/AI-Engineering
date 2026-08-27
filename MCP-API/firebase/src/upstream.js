import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { TOOL_MAP } from "./policy.js";

export class FirebaseUpstream {
  constructor(config) {
    this.config = config;
    this.client = null;
    this.transport = null;
    this.toolsByName = new Map();
  }

  async connect() {
    if (this.client) return;

    const transport = new StdioClientTransport({
      command: this.config.command,
      args: this.config.args,
      cwd: this.config.projectDir,
      env: { ...process.env }
    });

    const client = new Client(
      { name: "firebase-guarded-proxy", version: "1.0.0" },
      { capabilities: {} }
    );

    await client.connect(transport);
    const response = await client.listTools();
    const allowlisted = new Set(Object.values(TOOL_MAP).map((x) => x.upstream));
    this.toolsByName = new Map((response.tools || []).filter((tool) => allowlisted.has(tool.name)).map((tool) => [tool.name, tool]));

    const missing = [...allowlisted].filter((name) => !this.toolsByName.has(name));
    if (missing.length) {
      await client.close().catch(() => {});
      throw new Error(`Official Firebase MCP server is missing required allowlisted tools: ${missing.join(", ")}`);
    }

    this.client = client;
    this.transport = transport;
  }

  async close() {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.transport = null;
      this.toolsByName.clear();
    }
  }

  async listAllowedTools() {
    await this.connect();
    return this.toolsByName;
  }

  async call(upstreamName, args) {
    await this.connect();
    return withTimeout(this.client.callTool({ name: upstreamName, arguments: args }), this.config.timeoutMs, `Firebase MCP tool ${upstreamName}`);
  }
}

async function withTimeout(promise, timeoutMs, label) {
  let timer;
  try {
    return await Promise.race([
      promise,
      new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error(`${label} timed out after ${timeoutMs}ms`)), timeoutMs);
        timer.unref?.();
      })
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}
