import type { Config } from './config.js';

export class BetterStackApiError extends Error {
  constructor(public status: number, public details: unknown, message: string) { super(message); }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
};

export class BetterStackClient {
  constructor(private readonly config: Config, private readonly fetchImpl: typeof fetch = fetch) {}

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const method = options.method ?? 'GET';
    const url = new URL(this.config.apiBaseUrl + path);
    for (const [key, value] of Object.entries(options.query ?? {})) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }

    const maxAttempts = method === 'GET' ? 3 : 1;
    let lastError: unknown;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const response = await this.fetchImpl(url, {
          method,
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${this.config.apiToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'User-Agent': 'ai-engineering-better-stack-mcp/1.0'
          },
          body: options.body === undefined ? undefined : JSON.stringify(options.body)
        });
        const text = await response.text();
        let data: unknown = {};
        if (text) {
          try { data = JSON.parse(text); } catch { data = { raw: text }; }
        }
        if (response.ok) return data as T;

        if (response.status === 429 && attempt < maxAttempts) {
          const retryAfter = Number(response.headers.get('retry-after') ?? '1');
          await new Promise(resolve => setTimeout(resolve, Math.min(Math.max(retryAfter, 0), 10) * 1000));
          continue;
        }
        throw new BetterStackApiError(response.status, data, `Better Stack API ${method} ${path} failed with HTTP ${response.status}`);
      } catch (error) {
        lastError = error;
        if (error instanceof BetterStackApiError) throw error;
        if (attempt === maxAttempts) {
          throw new Error(`NETWORK_OR_TIMEOUT: ${error instanceof Error ? error.message : String(error)}`);
        }
        await new Promise(resolve => setTimeout(resolve, 250 * 2 ** (attempt - 1)));
      } finally {
        clearTimeout(timer);
      }
    }
    throw lastError;
  }
}
