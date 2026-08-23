import { Config } from './config.js';

export class DigitalOceanApiError extends Error {
  constructor(public status: number, message: string, public retryAfter?: number) { super(message); }
}

export class DigitalOceanRest {
  constructor(private readonly config: Config, private readonly fetchImpl: typeof fetch = fetch) {}

  async request<T>(method: string, path: string, body?: unknown, query?: Record<string, string | number | undefined>): Promise<T> {
    const url = new URL(`${this.config.apiBaseUrl}${path}`);
    for (const [key, value] of Object.entries(query ?? {})) if (value !== undefined) url.searchParams.set(key, String(value));

    for (let attempt = 0; ; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const response = await this.fetchImpl(url, {
          method,
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${this.config.token}`,
            Accept: 'application/json',
            ...(body === undefined ? {} : { 'Content-Type': 'application/json' })
          },
          body: body === undefined ? undefined : JSON.stringify(body)
        });
        const retryAfter = Number(response.headers.get('retry-after') ?? 0);
        const retryable = response.status === 429 || response.status >= 500;
        if (retryable && attempt < this.config.maxRetries) {
          const delay = retryAfter > 0 ? retryAfter * 1000 : Math.min(8000, 250 * 2 ** attempt);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        if (!response.ok) {
          const text = await response.text();
          throw new DigitalOceanApiError(response.status, `DigitalOcean API ${response.status}: ${text.slice(0, 2000)}`, retryAfter || undefined);
        }
        if (response.status === 204) return undefined as T;
        return await response.json() as T;
      } catch (error) {
        if (error instanceof DigitalOceanApiError) throw error;
        if (error instanceof DOMException && error.name === 'AbortError') throw new Error(`DigitalOcean API timeout after ${this.config.timeoutMs}ms`);
        if (attempt >= this.config.maxRetries) throw error;
        await new Promise(resolve => setTimeout(resolve, Math.min(8000, 250 * 2 ** attempt)));
      } finally {
        clearTimeout(timer);
      }
    }
  }

  get<T>(path: string, query?: Record<string, string | number | undefined>) { return this.request<T>('GET', path, undefined, query); }
  post<T>(path: string, body?: unknown) { return this.request<T>('POST', path, body); }
}
