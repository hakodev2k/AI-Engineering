import { MistralConfig } from './config.js';

export class MistralApiError extends Error {
  constructor(public readonly status: number, message: string, public readonly retryAfter?: number) { super(message); }
}

export class MistralClient {
  constructor(private readonly config: MistralConfig, private readonly fetchImpl: typeof fetch = fetch) {}

  async request<T>(method: 'GET' | 'POST', path: string, body?: unknown, query?: Record<string, string | number | undefined>): Promise<T> {
    const url = new URL(path, `${this.config.baseUrl}/`);
    for (const [key, value] of Object.entries(query ?? {})) if (value !== undefined) url.searchParams.set(key, String(value));
    const idempotent = method === 'GET';
    for (let attempt = 0; ; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const res = await this.fetchImpl(url, {
          method,
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${this.config.apiKey}`,
            Accept: 'application/json',
            ...(body === undefined ? {} : { 'Content-Type': 'application/json' })
          },
          body: body === undefined ? undefined : JSON.stringify(body)
        });
        const retryAfter = Number(res.headers.get('retry-after') ?? 0) || undefined;
        if (!res.ok) {
          const text = await res.text();
          if (idempotent && (res.status === 429 || res.status >= 500) && attempt < this.config.maxRetries) {
            const delay = retryAfter ? retryAfter * 1000 : Math.min(8000, 250 * 2 ** attempt);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
          throw new MistralApiError(res.status, `Mistral API ${res.status}: ${text.slice(0, 2000)}`, retryAfter);
        }
        return await res.json() as T;
      } catch (err) {
        if (err instanceof MistralApiError) throw err;
        if (err instanceof DOMException && err.name === 'AbortError') throw new Error(`Mistral API timeout after ${this.config.timeoutMs}ms`);
        if (!idempotent || attempt >= this.config.maxRetries) throw err;
        await new Promise(resolve => setTimeout(resolve, Math.min(8000, 250 * 2 ** attempt)));
      } finally {
        clearTimeout(timer);
      }
    }
  }

  get<T>(path: string, query?: Record<string, string | number | undefined>) { return this.request<T>('GET', path, undefined, query); }
  post<T>(path: string, body: unknown) { return this.request<T>('POST', path, body); }
}
