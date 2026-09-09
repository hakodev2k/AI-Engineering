import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import type { Config } from './config.js';

export class SonarError extends Error {
  constructor(message: string, readonly status?: number, readonly retryAfter?: string | null) {
    super(message);
  }
}

type FetchLike = typeof fetch;

export class SonarRestClient {
  constructor(private readonly cfg: Config, private readonly fetchFn: FetchLike = fetch) {}

  async request(method: 'GET' | 'POST', path: string, params: Record<string, unknown>, retryable = false): Promise<unknown> {
    const url = new URL(`${this.cfg.baseUrl}/api/${path.replace(/^\//, '')}`);
    const body = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null || value === '') continue;
      const serialized = Array.isArray(value) ? value.join(',') : String(value);
      if (method === 'GET') url.searchParams.set(key, serialized);
      else body.set(key, serialized);
    }

    for (let attempt = 0; attempt < (retryable ? 3 : 1); attempt++) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), this.cfg.timeoutMs);
      try {
        const response = await this.fetchFn(url, {
          method,
          headers: {
            Authorization: `Bearer ${this.cfg.token}`,
            Accept: 'application/json',
            ...(method === 'POST' ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {})
          },
          body: method === 'POST' ? body : undefined,
          signal: controller.signal
        });
        if (response.ok) {
          if (response.status === 204) return { ok: true };
          return await response.json();
        }
        const retryAfter = response.headers.get('retry-after');
        const text = (await response.text()).slice(0, 2000);
        if (response.status === 429 && retryable && attempt < 2) {
          const seconds = Math.min(Number(retryAfter || '1') || 1, 5);
          await new Promise((resolve) => setTimeout(resolve, seconds * 1000 * (attempt + 1)));
          continue;
        }
        throw new SonarError(`SonarQube Cloud API ${response.status}: ${text || response.statusText}`, response.status, retryAfter);
      } catch (error) {
        if (error instanceof SonarError) throw error;
        if (error instanceof Error && error.name === 'AbortError') throw new SonarError('SonarQube Cloud request timed out');
        throw new SonarError(`SonarQube Cloud network failure: ${error instanceof Error ? error.message : String(error)}`);
      } finally {
        clearTimeout(timeout);
      }
    }
    throw new SonarError('SonarQube Cloud request exhausted retry budget');
  }
}

export class OfficialSonarMcpClient {
  private client?: Client;
  private transport?: StdioClientTransport;

  constructor(private readonly cfg: Config) {}

  async call(tool: string, args: Record<string, unknown>): Promise<unknown> {
    if (!this.cfg.mcpEnabled) throw new Error('Official MCP transport is disabled');
    if (!this.client) {
      const env: Record<string, string> = {
        SONARQUBE_TOKEN: this.cfg.token,
        SONARQUBE_ORG: this.cfg.organization,
        TELEMETRY_DISABLED: 'true'
      };
      if (this.cfg.baseUrl === 'https://sonarqube.us') env.SONARQUBE_URL = this.cfg.baseUrl;
      this.transport = new StdioClientTransport({
        command: 'docker',
        args: ['run', '--rm', '-i', '--init', '--pull=missing', '-e', 'SONARQUBE_TOKEN', '-e', 'SONARQUBE_ORG', '-e', 'SONARQUBE_URL', '-e', 'TELEMETRY_DISABLED', this.cfg.mcpImage],
        env
      });
      this.client = new Client({ name: 'sonarcloud-reusable-connector', version: '1.0.0' });
      await this.client.connect(this.transport);
    }
    return this.client.callTool({ name: tool, arguments: args });
  }

  async close(): Promise<void> {
    await this.transport?.close();
    this.client = undefined;
    this.transport = undefined;
  }
}

export class SonarUpstream {
  readonly rest: SonarRestClient;
  readonly mcp: OfficialSonarMcpClient;

  constructor(readonly cfg: Config, fetchFn: FetchLike = fetch) {
    this.rest = new SonarRestClient(cfg, fetchFn);
    this.mcp = new OfficialSonarMcpClient(cfg);
  }

  async mcpFirst(tool: string, args: Record<string, unknown>, fallback?: () => Promise<unknown>): Promise<{ transport: 'mcp' | 'rest'; data: unknown }> {
    try {
      return { transport: 'mcp', data: await this.mcp.call(tool, args) };
    } catch (error) {
      if (!fallback) throw new Error(`Official SonarQube MCP failed and no API fallback exists: ${error instanceof Error ? error.message : String(error)}`);
      return { transport: 'rest', data: await fallback() };
    }
  }
}
