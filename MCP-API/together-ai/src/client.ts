import type { TogetherConfig } from './config.js';

export class TogetherApiError extends Error {
  constructor(public status: number, message: string, public retryAfter?: number) { super(message); }
}

export class TogetherClient {
  constructor(private readonly config: TogetherConfig, private readonly fetchImpl: typeof fetch = fetch) {}

  async request<T>(method: 'GET' | 'POST', path: string, body?: unknown, query?: Record<string, string | number | boolean | undefined>): Promise<T> {
    const url = new URL(`${this.config.baseUrl}${path}`);
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
            Authorization: `Bearer ${this.config.apiKey}`,
            Accept: 'application/json',
            ...(body === undefined ? {} : { 'Content-Type': 'application/json' })
          },
          body: body === undefined ? undefined : JSON.stringify(body)
        });
        const retryAfter = Number(response.headers.get('retry-after') ?? 0);
        if (retryableMethod && (response.status === 429 || response.status === 503 || response.status === 504) && attempt < this.config.maxRetries) {
          const delay = retryAfter > 0 ? retryAfter * 1000 : Math.min(8000, 250 * 2 ** attempt);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        const text = await response.text();
        if (!response.ok) throw new TogetherApiError(response.status, `Together API ${response.status}: ${text.slice(0, 2000)}`, retryAfter || undefined);
        return (text ? JSON.parse(text) : undefined) as T;
      } catch (error) {
        if (error instanceof TogetherApiError) throw error;
        if (error instanceof DOMException && error.name === 'AbortError') throw new Error(`Together API timeout after ${this.config.timeoutMs}ms`);
        if (!retryableMethod || attempt >= this.config.maxRetries) throw error;
        await new Promise(resolve => setTimeout(resolve, Math.min(8000, 250 * 2 ** attempt)));
      } finally {
        clearTimeout(timer);
      }
    }
  }

  get<T>(path: string, query?: Record<string, string | number | boolean | undefined>) { return this.request<T>('GET', path, undefined, query); }
  post<T>(path: string, body: unknown) { return this.request<T>('POST', path, body); }
}
