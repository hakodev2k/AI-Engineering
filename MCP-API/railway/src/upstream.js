import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

export class RailwayUpstream {
  constructor(config, { client = null, transport = null } = {}) {
    this.config = config;
    this.client = client || new Client(
      { name: "ai-engineering-railway-connector", version: "1.0.0" },
      { capabilities: {} }
    );
    this.transport = transport || new StdioClientTransport({
      command: config.cliPath,
      args: ["mcp"],
      stderr: "pipe"
    });
    this.connected = false;
    this.toolCache = null;
    this.connectPromise = null;
  }

  async ensureConnected() {
    if (this.connected) return;
    if (!this.connectPromise) {
      this.connectPromise = this.client.connect(this.transport).then(() => {
        this.connected = true;
      }).finally(() => {
        this.connectPromise = null;
      });
    }
    await this.withTimeout(this.connectPromise);
  }

  async listTools() {
    await this.ensureConnected();
    if (!this.toolCache) {
      const result = await this.withTimeout(this.client.listTools());
      this.toolCache = new Map(result.tools.map((tool) => [tool.name, tool]));
    }
    return this.toolCache;
  }

  async getTool(name) {
    const tools = await this.listTools();
    return tools.get(name);
  }

  async callTool(name, args) {
    await this.ensureConnected();
    const tools = await this.listTools();
    if (!tools.has(name)) throw new Error(`Official Railway MCP does not expose required tool: ${name}`);
    return this.withTimeout(this.client.callTool({ name, arguments: args }));
  }

  async close() {
    if (this.connected) {
      await this.client.close();
      this.connected = false;
    }
  }

  async withTimeout(promise) {
    let timer;
    const timeout = new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error(`Railway MCP operation timed out after ${this.config.timeoutMs}ms`)), this.config.timeoutMs);
      timer.unref?.();
    });
    try {
      return await Promise.race([promise, timeout]);
    } finally {
      clearTimeout(timer);
    }
  }
}
