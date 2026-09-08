import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { upstreamAllowlist } from "./tools.js";

function delay(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }
function isTransient(error) {
  const text = String(error?.message || error).toLowerCase();
  return /(timeout|timed out|429|rate limit|econn|closed|broken pipe|502|503|504)/.test(text);
}
function safeEnv(extra) {
  const out = {};
  for (const [key, value] of Object.entries({ ...process.env, ...extra })) if (typeof value === "string") out[key] = value;
  return out;
}

export class PorkbunUpstream {
  constructor(config) {
    this.config = config;
    this.client = null;
    this.transport = null;
    this.advertised = new Set();
  }

  async connect() {
    if (this.client) return;
    const transport = new StdioClientTransport({
      command: this.config.upstreamCommand,
      args: ["-y", this.config.upstreamPackage],
      env: safeEnv({
        PORKBUN_API_KEY: this.config.apiKey,
        PORKBUN_SECRET_API_KEY: this.config.secretApiKey
      }),
      stderr: "pipe"
    });
    const client = new Client({ name: "ai-engineering-porkbun-connector", version: "1.0.0" }, { capabilities: {} });
    await client.connect(transport);
    const listed = await client.listTools();
    this.advertised = new Set((listed.tools || []).map((tool) => tool.name));
    const missing = [...upstreamAllowlist].filter((name) => !this.advertised.has(name));
    if (missing.length) {
      await client.close().catch(() => {});
      throw new Error(`UPSTREAM_TOOL_MISMATCH: official Porkbun MCP is missing allowlisted tools: ${missing.join(", ")}`);
    }
    this.client = client;
    this.transport = transport;
  }

  async reset() {
    const client = this.client;
    this.client = null;
    this.transport = null;
    this.advertised = new Set();
    if (client) await client.close().catch(() => {});
  }

  async close() { await this.reset(); }

  async call(upstreamName, args, { readOnly = false } = {}) {
    if (!upstreamAllowlist.has(upstreamName)) throw new Error(`UPSTREAM_TOOL_DENIED: ${upstreamName}`);
    const attempts = readOnly ? this.config.maxReadRetries + 1 : 1;
    let lastError;
    for (let attempt = 0; attempt < attempts; attempt += 1) {
      try {
        await this.connect();
        const call = this.client.callTool({ name: upstreamName, arguments: args });
        const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("UPSTREAM_TIMEOUT")), this.config.timeoutMs));
        return await Promise.race([call, timeout]);
      } catch (error) {
        lastError = error;
        await this.reset();
        if (!readOnly || !isTransient(error) || attempt + 1 >= attempts) break;
        await delay(Math.min(250 * (2 ** attempt), 2000));
      }
    }
    throw lastError;
  }
}
