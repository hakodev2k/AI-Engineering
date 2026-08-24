import { CohereConfig } from './config.js';

export class CohereError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly retryAfterSeconds?: number,
    public readonly requestId?: string
  ) { super(message); }
}

export class CohereClient {
  constructor(private readonly config: CohereConfig, private readonly fetchImpl: typeof fetch = fetch) {}

  async request<T>(method: 'GET' | 'POST', path: string, body?: unknown, query?: Record<string, string | number | undefined>): Promise<T> {
    const url = new URL(`${this.config.baseUrl}${path}`);
    for (const [key, value] of Object.entries(query ?? {})) if (value !== undefined) url.searchParams.set(key, String(value));
    const retrySafe = method === 'GET';

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
            'X-Client-Name': this.config.clientName,
            ...(body === undefined ? {} : { 'Content-Type': 'application/json' })
          },
          body: body === undefined ? undefined : JSON.stringify(body)
        });
        const retryAfter = Number(response.headers.get('retry-after') ?? 0) || undefined;
        const requestId = response.headers.get('x-request-id') ?? undefined;
        if (retrySafe && (response.status === 429 || response.status >= 500) && attempt < this.config.maxRetries) {
          const delayMs = retryAfter ? retryAfter * 1000 : Math.min(8000, 250 * 2 ** attempt);
          await new Promise(resolve => setTimeout(resolve, delayMs));
          continue;
        }
        if (!response.ok) {
          const text = await response.text();
          throw new CohereError(response.status, `Cohere API ${response.status}: ${text.slice(0, 2000)}`, retryAfter, requestId);
        }
        if (response.status === 204) return undefined as T;
        return await response.json() as T;
      } catch (error) {
        if (error instanceof CohereError) throw error;
        if (error instanceof DOMException && error.name === 'AbortError') throw new Error(`Cohere API timeout after ${this.config.timeoutMs}ms`);
        if (!retrySafe || attempt >= this.config.maxRetries) throw error;
        await new Promise(resolve => setTimeout(resolve, Math.min(8000, 250 * 2 ** attempt)));
      } finally {
        clearTimeout(timer);
      }
    }
  }

  get<T>(path: string, query?: Record<string, string | number | undefined>) {
    return this.request<T>('GET', path, undefined, query);
  }

  post<T>(path: string, body: unknown) {
    return this.request<T>('POST', path, body);
  }
}
