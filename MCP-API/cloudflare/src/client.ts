import type { Config } from './config.js';

export class CloudflareApiError extends Error {
  constructor(public status: number, public details: unknown, message: string) { super(message); }
}

type RequestOptions = { method?: 'GET'|'POST'|'PATCH'|'DELETE'; body?: unknown; query?: Record<string, string|number|boolean|undefined> };

export class CloudflareClient {
  constructor(private readonly config: Config, private readonly fetchImpl: typeof fetch = fetch) {}

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const method = options.method ?? 'GET';
    const url = new URL(this.config.baseUrl + path);
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
          headers: {
            Authorization: `Bearer ${this.config.apiToken}`,
            'Content-Type': 'application/json',
            'User-Agent': 'ai-engineering-cloudflare-mcp/1.0'
          },
          body: options.body === undefined ? undefined : JSON.stringify(options.body)
        });
        const text = await response.text();
        const data = text ? JSON.parse(text) : {};
        if (response.ok && data?.success !== false) return data as T;

        if (response.status === 429 && attempt < maxAttempts) {
          const retryAfter = Math.min(Number(response.headers.get('retry-after') ?? 1), 10);
          await new Promise(r => setTimeout(r, retryAfter * 1000));
          continue;
        }
        throw new CloudflareApiError(response.status, data, `Cloudflare API ${method} ${path} failed with HTTP ${response.status}`);
      } catch (error) {
        lastError = error;
        if (error instanceof CloudflareApiError) throw error;
        if (attempt === maxAttempts) throw new Error(`NETWORK_OR_TIMEOUT: ${error instanceof Error ? error.message : String(error)}`);
        await new Promise(r => setTimeout(r, 250 * 2 ** (attempt - 1)));
      } finally {
        clearTimeout(timer);
      }
    }
    throw lastError;
  }
}
