import { ElasticConfig } from './config.js';

export class ElasticHttpError extends Error {
  constructor(public readonly status: number, message: string, public readonly retryAfter?: number) { super(message); }
}

export class ElasticClient {
  constructor(private readonly config: ElasticConfig, private readonly fetchImpl: typeof fetch = fetch) {}

  private authHeader() {
    if (this.config.authMode === 'api-key') return `ApiKey ${this.config.apiKey}`;
    if (this.config.authMode === 'bearer') return `Bearer ${this.config.bearerToken}`;
    return `Basic ${Buffer.from(`${this.config.username}:${this.config.password}`).toString('base64')}`;
  }

  async request<T>(method: string, path: string, body?: unknown, query?: Record<string, string | number | boolean | undefined>, retryable = true): Promise<T> {
    const url = new URL(`${this.config.baseUrl}${path}`);
    for (const [key, value] of Object.entries(query ?? {})) if (value !== undefined) url.searchParams.set(key, String(value));
    for (let attempt = 0; ; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const response = await this.fetchImpl(url, {
          method,
          signal: controller.signal,
          headers: {
            Authorization: this.authHeader(),
            Accept: 'application/json',
            ...(body === undefined ? {} : { 'Content-Type': 'application/json' })
          },
          body: body === undefined ? undefined : JSON.stringify(body)
        });
        const retryAfter = Number(response.headers.get('retry-after') ?? 0);
        const transient = response.status === 429 || response.status === 502 || response.status === 503 || response.status === 504;
        if (transient && retryable && attempt < this.config.maxRetries) {
          const delay = retryAfter > 0 ? retryAfter * 1000 : Math.min(10000, 250 * 2 ** attempt);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        if (!response.ok) {
          const text = await response.text();
          throw new ElasticHttpError(response.status, `Elasticsearch ${response.status}: ${text.slice(0, 4000)}`, retryAfter || undefined);
        }
        if (response.status === 204) return undefined as T;
        return await response.json() as T;
      } catch (error) {
        if (error instanceof ElasticHttpError) throw error;
        if (error instanceof DOMException && error.name === 'AbortError') throw new Error(`Elasticsearch request timed out after ${this.config.timeoutMs}ms`);
        if (!retryable || attempt >= this.config.maxRetries) throw error;
        await new Promise(resolve => setTimeout(resolve, Math.min(10000, 250 * 2 ** attempt)));
      } finally {
        clearTimeout(timer);
      }
    }
  }

  get<T>(path: string, query?: Record<string, string | number | boolean | undefined>) { return this.request<T>('GET', path, undefined, query); }
  post<T>(path: string, body?: unknown, retryable = true) { return this.request<T>('POST', path, body, undefined, retryable); }
  put<T>(path: string, body?: unknown, retryable = true) { return this.request<T>('PUT', path, body, undefined, retryable); }
  delete<T>(path: string, retryable = false) { return this.request<T>('DELETE', path, undefined, undefined, retryable); }
}
