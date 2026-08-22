import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import type { Config } from './config.js';

export const ALLOWED_UPSTREAM_TOOLS = new Set([
  'search_voices',
  'get_voice',
  'list_models',
  'check_subscription',
  'list_agents',
  'get_agent',
  'list_conversations',
  'get_conversation',
  'text_to_speech',
  'speech_to_text',
  'text_to_sound_effects'
]);

export class ElevenLabsUpstream {
  private client?: Client;
  private transport?: StdioClientTransport;

  constructor(private readonly config: Config) {}

  async connect() {
    if (this.client) return;
    const env: Record<string, string> = {
      ...Object.fromEntries(Object.entries(process.env).filter((entry): entry is [string, string] => typeof entry[1] === 'string')),
      ELEVENLABS_API_KEY: this.config.apiKey,
      ELEVENLABS_API_RESIDENCY: this.config.residency,
      ELEVENLABS_MCP_OUTPUT_MODE: this.config.outputMode
    };
    if (this.config.basePath) env.ELEVENLABS_MCP_BASE_PATH = this.config.basePath;

    this.transport = new StdioClientTransport({
      command: this.config.command,
      args: this.config.args,
      env
    });
    this.client = new Client({ name: 'ai-engineering-elevenlabs-wrapper', version: '1.0.0' });
    await this.withTimeout(this.client.connect(this.transport), 'connect');

    const tools = await this.withTimeout(this.client.listTools(), 'listTools');
    const names = new Set(tools.tools.map(t => t.name));
    for (const required of ALLOWED_UPSTREAM_TOOLS) {
      if (!names.has(required)) throw new Error(`UPSTREAM_TOOL_MISSING: ${required}`);
    }
  }

  async call(tool: string, args: Record<string, unknown>) {
    if (!ALLOWED_UPSTREAM_TOOLS.has(tool)) throw new Error(`UPSTREAM_TOOL_DENIED: ${tool}`);
    await this.connect();
    return await this.withTimeout(this.client!.callTool({ name: tool, arguments: args }), tool);
  }

  async close() {
    await this.transport?.close();
    this.client = undefined;
    this.transport = undefined;
  }

  private async withTimeout<T>(promise: Promise<T>, operation: string): Promise<T> {
    let timer: NodeJS.Timeout | undefined;
    try {
      return await Promise.race([
        promise,
        new Promise<never>((_, reject) => {
          timer = setTimeout(() => reject(new Error(`UPSTREAM_TIMEOUT: ${operation}`)), this.config.timeoutMs);
        })
      ]);
    } finally {
      if (timer) clearTimeout(timer);
    }
  }
}
