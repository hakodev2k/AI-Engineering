import type { Config } from './config.js';
import { GoogleTokenProvider } from './auth.js';

type FetchLike = typeof fetch;

const ALLOWED_MCP_TOOLS = new Set([
  'list_calendars', 'search_events', 'list_events', 'get_event', 'suggest_time',
  'create_event', 'update_event', 'respond_to_event', 'delete_event'
]);

function retryAfterMs(value: string | null): number | undefined {
  if (!value) return undefined;
  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds >= 0) return Math.min(seconds * 1000, 60_000);
  const date = Date.parse(value);
  if (!Number.isNaN(date)) return Math.min(Math.max(0, date - Date.now()), 60_000);
  return undefined;
}

function parseMcpBody(contentType: string, text: string): unknown {
  if (contentType.includes('text/event-stream')) {
    const payload = text.split(/\r?\n/).filter((line) => line.startsWith('data:')).map((line) => line.slice(5).trim()).filter((x) => x && x !== '[DONE]').at(-1);
    if (!payload) throw new Error('Google Calendar MCP returned an empty event stream');
    return JSON.parse(payload);
  }
  return JSON.parse(text);
}

export class GoogleCalendarUpstream {
  private nextId = 1;
  constructor(
    private readonly config: Config,
    private readonly tokens: GoogleTokenProvider,
    private readonly fetchImpl: FetchLike = fetch,
    private readonly sleep: (ms: number) => Promise<void> = (ms) => new Promise((r) => setTimeout(r, ms))
  ) {}

  private async authenticatedFetch(url: string, init: RequestInit, retryable: boolean): Promise<Response> {
    let refreshed = false;
    for (let attempt = 0; ; attempt++) {
      const token = await this.tokens.getToken();
      const response = await this.fetchImpl(url, {
        ...init,
        headers: { ...(init.headers ?? {}), authorization: `Bearer ${token}` },
        signal: AbortSignal.timeout(this.config.timeoutMs),
        redirect: 'error'
      });
      if (response.status === 401 && !refreshed && this.config.refreshToken) {
        refreshed = true;
        this.tokens.invalidate();
        continue;
      }
      const throttled = response.status === 429 || response.status === 503 || response.status === 502 || response.status === 504;
      if (!response.ok && retryable && throttled && attempt < this.config.maxRetries) {
        const delay = retryAfterMs(response.headers.get('retry-after')) ?? Math.min(1000 * 2 ** attempt + Math.floor(Math.random() * 250), 8000);
        await this.sleep(delay);
        continue;
      }
      return response;
    }
  }

  async mcp(tool: string, args: Record<string, unknown>, retryable = true): Promise<unknown> {
    if (!ALLOWED_MCP_TOOLS.has(tool)) throw new Error(`Google Calendar MCP tool ${tool} is not allowlisted`);
    const response = await this.authenticatedFetch(this.config.mcpUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream' },
      body: JSON.stringify({ jsonrpc: '2.0', id: this.nextId++, method: 'tools/call', params: { name: tool, arguments: args } })
    }, retryable);
    const text = await response.text();
    if (!response.ok) throw new Error(`Google Calendar MCP error ${response.status}${response.status === 403 ? ': check OAuth scopes or Developer Preview access' : ''}`);
    const parsed = parseMcpBody(response.headers.get('content-type') ?? '', text) as { error?: { code?: number; message?: string }; result?: unknown };
    if (parsed.error) throw new Error(`Google Calendar MCP RPC error ${parsed.error.code ?? 'unknown'}: ${parsed.error.message ?? 'request failed'}`);
    return parsed.result;
  }

  async rest(method: 'GET' | 'POST', path: string, query: Record<string, string | number | boolean | undefined> = {}, body?: unknown, retryable = method === 'GET'): Promise<unknown> {
    if (!path.startsWith('/calendars/')) throw new Error('REST fallback path is not allowlisted');
    const url = new URL(this.config.apiBaseUrl + path);
    for (const [key, value] of Object.entries(query)) if (value !== undefined) url.searchParams.set(key, String(value));
    const response = await this.authenticatedFetch(url.toString(), {
      method,
      headers: body === undefined ? undefined : { 'content-type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body)
    }, retryable);
    if (response.status === 204) return { ok: true };
    const text = await response.text();
    if (!response.ok) throw new Error(`Google Calendar REST error ${response.status}${response.status === 403 ? ': permission, quota, or scope denied' : ''}`);
    return text ? JSON.parse(text) : { ok: true };
  }
}
