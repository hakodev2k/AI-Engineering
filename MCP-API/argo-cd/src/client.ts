import { ArgoCdConfig } from './config.js';

export class ArgoCdError extends Error {
  constructor(public readonly status: number, message: string, public readonly retryAfterSeconds?: number) {
    super(message);
  }
}

export class ArgoCdClient {
  constructor(private readonly config: ArgoCdConfig, private readonly fetchImpl: typeof fetch = fetch) {}

  async request<T>(method: 'GET' | 'POST', path: string, options: {
    query?: Record<string, string | number | boolean | undefined>;
    body?: unknown;
  } = {}): Promise<T> {
    const url = new URL(`${this.config.serverUrl}${path}`);
    for (const [key, value] of Object.entries(options.query ?? {})) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
    const retrySafe = method === 'GET';
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
            ...(options.body === undefined ? {} : { 'Content-Type': 'application/json' })
          },
          body: options.body === undefined ? undefined : JSON.stringify(options.body)
        });
        const retryAfter = Number(response.headers.get('retry-after') ?? 0) || undefined;
        if (retrySafe && (response.status === 429 || response.status >= 500) && attempt < this.config.maxRetries) {
          const delayMs = retryAfter ? retryAfter * 1000 : Math.min(8000, 250 * 2 ** attempt);
          await new Promise(resolve => setTimeout(resolve, delayMs));
          continue;
        }
        if (!response.ok) {
          const text = (await response.text()).slice(0, 4000);
          throw new ArgoCdError(response.status, `Argo CD API ${response.status}: ${text}`, retryAfter);
        }
        if (response.status === 204) return undefined as T;
        const contentType = response.headers.get('content-type') ?? '';
        if (contentType.includes('application/json')) return await response.json() as T;
        return await response.text() as T;
      } catch (error) {
        if (error instanceof ArgoCdError) throw error;
        if (error instanceof DOMException && error.name === 'AbortError') throw new Error(`Argo CD API timeout after ${this.config.timeoutMs}ms`);
        if (!retrySafe || attempt >= this.config.maxRetries) throw error;
        await new Promise(resolve => setTimeout(resolve, Math.min(8000, 250 * 2 ** attempt)));
      } finally {
        clearTimeout(timer);
      }
    }
  }

  get<T>(path: string, query?: Record<string, string | number | boolean | undefined>) {
    return this.request<T>('GET', path, { query });
  }

  post<T>(path: string, body?: unknown, query?: Record<string, string | number | boolean | undefined>) {
    return this.request<T>('POST', path, { body, query });
  }
}
