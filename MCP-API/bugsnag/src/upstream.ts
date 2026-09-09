import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import type { Config } from './config.js';
import { upstreamEnv } from './config.js';

export type UpstreamCallResult = Awaited<ReturnType<Client['callTool']>>;

type ToolDescriptor = { name: string; description?: string; title?: string };

export interface ToolBinding {
  aliases: string[];
  requiredTerms: string[];
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

export class BugsnagUpstream {
  private readonly client = new Client({ name: 'ai-engineering-bugsnag-facade', version: '1.0.0' });
  private transport?: StdioClientTransport;
  private tools: ToolDescriptor[] = [];

  constructor(private readonly config: Config) {}

  async connect(): Promise<void> {
    const env = Object.fromEntries(
      Object.entries(upstreamEnv(this.config)).filter((entry): entry is [string, string] => typeof entry[1] === 'string')
    );
    this.transport = new StdioClientTransport({
      command: this.config.BUGSNAG_UPSTREAM_COMMAND,
      args: ['-y', this.config.BUGSNAG_UPSTREAM_PACKAGE],
      env
    });
    await Promise.race([
      this.client.connect(this.transport),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Timed out starting official SmartBear MCP server')), this.config.BUGSNAG_UPSTREAM_START_TIMEOUT_MS))
    ]);
    const response = await this.client.listTools();
    this.tools = response.tools.map(t => ({ name: t.name, description: t.description, title: (t as { title?: string }).title }));
  }

  resolve(binding: ToolBinding): string {
    for (const alias of binding.aliases) {
      const exact = this.tools.find(t => t.name === alias);
      if (exact) return exact.name;
    }

    const matches = this.tools.filter(tool => {
      const haystack = normalize(`${tool.name} ${tool.title ?? ''} ${tool.description ?? ''}`);
      return binding.requiredTerms.every(term => haystack.includes(normalize(term)));
    });
    if (matches.length !== 1) {
      throw new Error(`Official BugSnag MCP capability resolution failed safely (${binding.requiredTerms.join(', ')}): found ${matches.length} candidates`);
    }
    return matches[0].name;
  }

  async call(binding: ToolBinding, args: Record<string, unknown>): Promise<UpstreamCallResult> {
    const name = this.resolve(binding);
    return await Promise.race([
      this.client.callTool({ name, arguments: args }),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error(`BugSnag tool timed out: ${name}`)), this.config.BUGSNAG_TOOL_TIMEOUT_MS))
    ]);
  }

  async close(): Promise<void> {
    await this.client.close();
  }
}
