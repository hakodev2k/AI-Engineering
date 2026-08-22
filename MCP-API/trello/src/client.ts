import type { Config } from './config.js';

export class TrelloApiError extends Error {
  constructor(public status: number, public details: unknown, message: string) { super(message); }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: Record<string, unknown>;
  query?: Record<string, string | number | boolean | undefined>;
};

export class TrelloClient {
  constructor(private readonly config: Config, private readonly fetchImpl: typeof fetch = fetch) {}

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const method = options.method ?? 'GET';
    const url = new URL(this.config.baseUrl + path);
    url.searchParams.set('key', this.config.apiKey);
    url.searchParams.set('token', this.config.token);
    for (const [k, v] of Object.entries(options.query ?? {})) if (v !== undefined) url.searchParams.set(k, String(v));

    const maxAttempts = method === 'GET' ? 3 : 1;
    let lastError: unknown;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const response = await this.fetchImpl(url, {
          method,
          signal: controller.signal,
          headers: { Accept: 'application/json', 'Content-Type': 'application/json', 'User-Agent': 'ai-engineering-trello-mcp/1.0' },
          body: options.body === undefined ? undefined : JSON.stringify(options.body)
        });
        const text = await response.text();
        let data: unknown = {};
        if (text) { try { data = JSON.parse(text); } catch { data = { raw: text }; } }
        if (response.ok) return data as T;
        if (response.status === 429 && attempt < maxAttempts) {
          const retryAfter = Number(response.headers.get('retry-after') ?? 1);
          await new Promise(r => setTimeout(r, Math.min(Math.max(retryAfter, 0), 10) * 1000));
          continue;
        }
        throw new TrelloApiError(response.status, data, `Trello API ${method} ${path} failed with HTTP ${response.status}`);
      } catch (error) {
        lastError = error;
        if (error instanceof TrelloApiError) throw error;
        if (attempt === maxAttempts) throw new Error(`NETWORK_OR_TIMEOUT: ${error instanceof Error ? error.message : String(error)}`);
        await new Promise(r => setTimeout(r, 250 * 2 ** (attempt - 1)));
      } finally { clearTimeout(timer); }
    }
    throw lastError;
  }
}
