import { GroqConfig } from './config.js';

export class GroqApiError extends Error {
  constructor(public status: number, message: string, public retryAfter?: number) { super(message); }
}

export class GroqClient {
  constructor(private readonly config: GroqConfig, private readonly fetchImpl: typeof fetch = fetch) {}

  async request<T>(method: 'GET' | 'POST' | 'DELETE', path: string, options?: { body?: unknown; query?: Record<string, string | number | undefined>; retrySafe?: boolean }): Promise<T> {
    const url = new URL(`${this.config.baseUrl}${path}`);
    for (const [key, value] of Object.entries(options?.query ?? {})) if (value !== undefined) url.searchParams.set(key, String(value));
    const retrySafe = options?.retrySafe ?? method === 'GET';
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
            ...(options?.body === undefined ? {} : { 'Content-Type': 'application/json' })
          },
          body: options?.body === undefined ? undefined : JSON.stringify(options.body)
        });
        const retryAfter = Number(res.headers.get('retry-after') ?? 0) || undefined;
        if (retrySafe && (res.status === 429 || res.status >= 500) && attempt < this.config.maxRetries) {
          const delay = retryAfter ? retryAfter * 1000 : Math.min(8000, 250 * 2 ** attempt);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        if (!res.ok) {
          const text = await res.text();
          throw new GroqApiError(res.status, `Groq API ${res.status}: ${text.slice(0, 2000)}`, retryAfter);
        }
        if (res.status === 204) return undefined as T;
        return await res.json() as T;
      } catch (error) {
        if (error instanceof GroqApiError) throw error;
        if (error instanceof DOMException && error.name === 'AbortError') throw new Error(`Groq API timeout after ${this.config.timeoutMs}ms`);
        if (!retrySafe || attempt >= this.config.maxRetries) throw error;
        await new Promise(resolve => setTimeout(resolve, Math.min(8000, 250 * 2 ** attempt)));
      } finally {
        clearTimeout(timer);
      }
    }
  }

  get<T>(path: string, query?: Record<string, string | number | undefined>) { return this.request<T>('GET', path, { query, retrySafe: true }); }
  post<T>(path: string, body?: unknown) { return this.request<T>('POST', path, { body, retrySafe: false }); }
  delete<T>(path: string) { return this.request<T>('DELETE', path, { retrySafe: false }); }
}
