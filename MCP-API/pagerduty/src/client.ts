import type { Config } from './config.js';

export class PagerDutyApiError extends Error {
  constructor(public status: number, public details: unknown, message: string) { super(message); }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
  requireFrom?: boolean;
};

export class PagerDutyClient {
  constructor(private readonly config: Config, private readonly fetchImpl: typeof fetch = fetch) {}

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const method = options.method ?? 'GET';
    const url = new URL(this.config.baseUrl + path);
    for (const [key, value] of Object.entries(options.query ?? {})) if (value !== undefined) url.searchParams.set(key, String(value));
    const maxAttempts = method === 'GET' ? 3 : 1;
    let lastError: unknown;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        if (options.requireFrom && !this.config.fromEmail) throw new Error('CONFIG_ERROR: PAGERDUTY_FROM_EMAIL is required for this operation');
        const headers: Record<string, string> = {
          Authorization: `Token token=${this.config.apiToken}`,
          Accept: 'application/vnd.pagerduty+json;version=2',
          'Content-Type': 'application/json',
          'User-Agent': 'ai-engineering-pagerduty-mcp/1.0'
        };
        if (options.requireFrom && this.config.fromEmail) headers.From = this.config.fromEmail;
        const response = await this.fetchImpl(url, {
          method,
          signal: controller.signal,
          headers,
          body: options.body === undefined ? undefined : JSON.stringify(options.body)
        });
        const text = await response.text();
        let data: unknown = {};
        if (text) { try { data = JSON.parse(text); } catch { data = { raw: text }; } }
        if (response.ok) return data as T;
        if (response.status === 429 && attempt < maxAttempts) {
          const wait = Math.min(Math.max(Number(response.headers.get('ratelimit-reset') ?? response.headers.get('retry-after') ?? 1), 0), 10);
          await new Promise(r => setTimeout(r, wait * 1000));
          continue;
        }
        throw new PagerDutyApiError(response.status, data, `PagerDuty API ${method} ${path} failed with HTTP ${response.status}`);
      } catch (error) {
        lastError = error;
        if (error instanceof PagerDutyApiError || String(error).includes('CONFIG_ERROR')) throw error;
        if (attempt === maxAttempts) throw new Error(`NETWORK_OR_TIMEOUT: ${error instanceof Error ? error.message : String(error)}`);
        await new Promise(r => setTimeout(r, 250 * 2 ** (attempt - 1)));
      } finally {
        clearTimeout(timer);
      }
    }
    throw lastError;
  }
}
