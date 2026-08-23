import { ReplicateConfig } from './config.js';

export class ReplicateError extends Error {
  constructor(public status: number, message: string, public retryAfter?: number) { super(message); }
}

export class ReplicateClient {
  constructor(private readonly config: ReplicateConfig, private readonly fetchImpl: typeof fetch = fetch) {}

  private async request<T>(method: string, path: string, options?: {
    body?: unknown;
    query?: Record<string, string | number | boolean | undefined>;
    headers?: Record<string, string>;
  }): Promise<T> {
    const url = new URL(`${this.config.baseUrl}${path}`);
    for (const [key, value] of Object.entries(options?.query ?? {})) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }

    for (let attempt = 0; ; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const response = await this.fetchImpl(url, {
          method,
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${this.config.apiToken}`,
            Accept: 'application/json',
            ...(options?.body === undefined ? {} : { 'Content-Type': 'application/json' }),
            ...options?.headers
          },
          body: options?.body === undefined ? undefined : JSON.stringify(options.body)
        });

        const retryAfter = Number(response.headers.get('retry-after') ?? 0);
        if ((response.status === 429 || response.status >= 500) && attempt < this.config.maxRetries && method === 'GET') {
          const delay = retryAfter > 0 ? retryAfter * 1000 : Math.min(8000, 250 * 2 ** attempt);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        if (!response.ok) {
          const text = await response.text();
          throw new ReplicateError(response.status, `Replicate API ${response.status}: ${text.slice(0, 2000)}`, retryAfter || undefined);
        }

        if (response.status === 204) return undefined as T;
        return await response.json() as T;
      } catch (error) {
        if (error instanceof ReplicateError) throw error;
        if (error instanceof DOMException && error.name === 'AbortError') throw new Error(`Replicate API timeout after ${this.config.timeoutMs}ms`);
        if (attempt >= this.config.maxRetries || method !== 'GET') throw error;
        await new Promise(resolve => setTimeout(resolve, Math.min(8000, 250 * 2 ** attempt)));
      } finally {
        clearTimeout(timer);
      }
    }
  }

  get<T>(path: string, query?: Record<string, string | number | boolean | undefined>) {
    return this.request<T>('GET', path, { query });
  }

  post<T>(path: string, body?: unknown, headers?: Record<string, string>) {
    return this.request<T>('POST', path, { body, headers });
  }
}
