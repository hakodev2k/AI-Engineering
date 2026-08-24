import { AnthropicConfig } from './config.js';

export class AnthropicApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly requestId?: string,
    public readonly retryAfterSeconds?: number
  ) { super(message); }
}

export class AnthropicClient {
  constructor(private readonly config: AnthropicConfig, private readonly fetchImpl: typeof fetch = fetch) {}

  private async request<T>(method: 'GET' | 'POST', path: string, body?: unknown, query?: Record<string, string | number | undefined>): Promise<T> {
    const url = new URL(path, this.config.baseUrl);
    for (const [key, value] of Object.entries(query ?? {})) if (value !== undefined) url.searchParams.set(key, String(value));
    const retryableMethod = method === 'GET';

    for (let attempt = 0; ; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const response = await this.fetchImpl(url, {
          method,
          signal: controller.signal,
          headers: {
            'x-api-key': this.config.apiKey,
            'anthropic-version': this.config.version,
            'content-type': 'application/json',
            'accept': path.endsWith('/results') ? 'application/jsonl, application/json' : 'application/json'
          },
          body: body === undefined ? undefined : JSON.stringify(body)
        });
        const retryAfter = Number(response.headers.get('retry-after') ?? 0) || undefined;
        const requestId = response.headers.get('request-id') ?? undefined;
        if (retryableMethod && (response.status === 429 || response.status >= 500) && attempt < this.config.maxRetries) {
          const delay = retryAfter ? retryAfter * 1000 : Math.min(8000, 250 * 2 ** attempt);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        if (!response.ok) {
          const text = await response.text();
          throw new AnthropicApiError(response.status, `Anthropic API ${response.status}: ${text.slice(0, 2000)}`, requestId, retryAfter);
        }
        const contentType = response.headers.get('content-type') ?? '';
        if (contentType.includes('application/json')) return await response.json() as T;
        return await response.text() as T;
      } catch (error) {
        if (error instanceof AnthropicApiError) throw error;
        if (error instanceof DOMException && error.name === 'AbortError') throw new Error(`Anthropic API timeout after ${this.config.timeoutMs}ms`);
        if (!retryableMethod || attempt >= this.config.maxRetries) throw error;
        await new Promise(resolve => setTimeout(resolve, Math.min(8000, 250 * 2 ** attempt)));
      } finally {
        clearTimeout(timer);
      }
    }
  }

  get<T>(path: string, query?: Record<string, string | number | undefined>) { return this.request<T>('GET', path, undefined, query); }
  post<T>(path: string, body: unknown) { return this.request<T>('POST', path, body); }
}
