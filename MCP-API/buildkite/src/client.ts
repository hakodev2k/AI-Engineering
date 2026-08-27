import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import type { Config } from './config.js';

export class BuildkiteError extends Error {
  constructor(message: string, public readonly status?: number, public readonly retryAfterSeconds?: number) {
    super(message);
  }
}

export class BuildkiteClient {
  private mcp?: Client;
  private transport?: StreamableHTTPClientTransport;

  constructor(private readonly config: Config, private readonly fetchFn: typeof fetch = fetch) {}

  async connect(): Promise<void> {
    if (this.mcp) return;
    const client = new Client({ name: 'ai-engineering-buildkite-connector', version: '1.0.0' });
    const transport = new StreamableHTTPClientTransport(new URL(this.config.mcpUrl), {
      requestInit: {
        headers: {
          Authorization: `Bearer ${this.config.token}`,
          'X-Buildkite-Toolsets': this.config.toolsets
        }
      }
    });
    await client.connect(transport);
    this.mcp = client;
    this.transport = transport;
  }

  async close(): Promise<void> {
    await this.transport?.close();
    this.mcp = undefined;
    this.transport = undefined;
  }

  async callMcp(name: string, args: Record<string, unknown>): Promise<unknown> {
    await this.connect();
    const result = await this.mcp!.callTool({ name, arguments: args });
    if (result.isError) {
      const text = result.content?.map((c: any) => c.type === 'text' ? c.text : JSON.stringify(c)).join('\n') || 'Buildkite MCP tool failed';
      throw new BuildkiteError(text);
    }
    if (result.structuredContent !== undefined) return result.structuredContent;
    return result.content;
  }

  async mcpWithReadFallback(name: string, args: Record<string, unknown>, fallbackPath: string): Promise<unknown> {
    try {
      return await this.callMcp(name, args);
    } catch (error) {
      return await this.rest('GET', fallbackPath, undefined, true);
    }
  }

  async rest(method: string, path: string, body?: unknown, retryableRead = false): Promise<unknown> {
    const safePath = path.startsWith('/') ? path : `/${path}`;
    const url = `${this.config.apiBaseUrl}${safePath}`;
    const attempts = retryableRead ? this.config.maxReadRetries : 1;
    let lastError: unknown;
    for (let attempt = 1; attempt <= attempts; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const response = await this.fetchFn(url, {
          method,
          headers: {
            Authorization: `Bearer ${this.config.token}`,
            Accept: 'application/json',
            ...(body === undefined ? {} : { 'Content-Type': 'application/json' })
          },
          body: body === undefined ? undefined : JSON.stringify(body),
          signal: controller.signal,
          redirect: 'manual'
        });
        const retryAfter = Number(response.headers.get('RateLimit-User-Reset') || response.headers.get('RateLimit-Reset') || response.headers.get('Retry-After') || '0');
        if ((response.status === 429 || response.status >= 500) && retryableRead && attempt < attempts) {
          await new Promise(resolve => setTimeout(resolve, Math.min(Math.max(retryAfter, 1) * 1000, 10_000) * attempt));
          continue;
        }
        if (!response.ok && response.status !== 302) {
          const text = await response.text();
          throw new BuildkiteError(`Buildkite REST ${response.status}: ${text.slice(0, 2000)}`, response.status, retryAfter || undefined);
        }
        if (response.status === 204) return { ok: true };
        if (response.status === 302) return { url: response.headers.get('location') };
        const text = await response.text();
        return text ? JSON.parse(text) : { ok: true };
      } catch (error) {
        lastError = error;
        if (!retryableRead || attempt >= attempts || error instanceof BuildkiteError && error.status && error.status < 500 && error.status !== 429) throw error;
        await new Promise(resolve => setTimeout(resolve, 250 * 2 ** (attempt - 1)));
      } finally {
        clearTimeout(timer);
      }
    }
    throw lastError;
  }
}

export function enc(value: string | number): string {
  return encodeURIComponent(String(value));
}
