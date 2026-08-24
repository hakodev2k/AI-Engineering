import { Config } from './config.js';

export class WeaviateRestClient {
  constructor(private readonly config: Config, private readonly fetchImpl: typeof fetch = fetch) {}

  async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    for (let attempt = 0; ; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const res = await this.fetchImpl(`${this.config.url}${path}`, {
          method,
          signal: controller.signal,
          headers: {
            Accept: 'application/json',
            ...(this.config.apiKey ? { Authorization: `Bearer ${this.config.apiKey}` } : {}),
            ...(body === undefined ? {} : { 'Content-Type': 'application/json' })
          },
          body: body === undefined ? undefined : JSON.stringify(body)
        });
        const retryAfter = Number(res.headers.get('retry-after') ?? 0);
        if ((res.status === 429 || res.status >= 500) && attempt < this.config.maxRetries) {
          await new Promise(r => setTimeout(r, retryAfter > 0 ? retryAfter * 1000 : Math.min(8000, 250 * 2 ** attempt)));
          continue;
        }
        if (!res.ok) throw new Error(`Weaviate REST ${res.status}: ${(await res.text()).slice(0, 2000)}`);
        if (res.status === 204) return undefined as T;
        return await res.json() as T;
      } catch (err) {
        if (attempt >= this.config.maxRetries || (err instanceof Error && /REST 4\d\d/.test(err.message))) throw err;
        await new Promise(r => setTimeout(r, Math.min(8000, 250 * 2 ** attempt)));
      } finally {
        clearTimeout(timer);
      }
    }
  }

  get<T>(path: string) { return this.request<T>('GET', path); }
  post<T>(path: string, body: unknown) { return this.request<T>('POST', path, body); }
  put<T>(path: string, body: unknown) { return this.request<T>('PUT', path, body); }
  delete<T>(path: string) { return this.request<T>('DELETE', path); }
}
