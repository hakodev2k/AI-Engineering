import { baseUrl, type SquareConfig } from './config.js';
import type { CredentialProvider } from './auth.js';

export class SquareApiError extends Error {
  constructor(public readonly status: number, public readonly code: string, message: string, public readonly retryAfter?: string) {
    super(message);
  }
}

export class SquareClient {
  constructor(
    private readonly config: SquareConfig,
    private readonly credentials: CredentialProvider,
    private readonly fetchImpl: typeof fetch = fetch
  ) {}

  async request<T>(method: string, path: string, options: { query?: Record<string, string | number | boolean | undefined>; body?: unknown; idempotencyKey?: string; signal?: AbortSignal; retrySafe?: boolean } = {}): Promise<T> {
    const url = new URL(baseUrl(this.config.environment) + path);
    for (const [key, value] of Object.entries(options.query ?? {})) if (value !== undefined) url.searchParams.set(key, String(value));

    const token = await this.credentials.getAccessToken();
    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
      'Square-Version': this.config.apiVersion,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    };
    if (options.idempotencyKey) headers['Idempotency-Key'] = options.idempotencyKey;

    const retryableMethod = method === 'GET' || method === 'HEAD' || options.retrySafe === true;
    let lastError: unknown;
    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      const abort = () => controller.abort();
      options.signal?.addEventListener('abort', abort, { once: true });
      try {
        const response = await this.fetchImpl(url, {
          method,
          headers,
          body: options.body === undefined ? undefined : JSON.stringify(options.body),
          signal: controller.signal
        });
        const text = await response.text();
        const data = text ? JSON.parse(text) : {};
        if (response.ok) return data as T;
        const first = data?.errors?.[0];
        const code = first?.code ?? `HTTP_${response.status}`;
        const message = first?.detail ?? first?.category ?? `Square API request failed with HTTP ${response.status}`;
        const retryAfter = response.headers.get('retry-after') ?? undefined;
        const error = new SquareApiError(response.status, code, message, retryAfter);
        if (!retryableMethod || attempt >= this.config.maxRetries || ![429, 500, 502, 503, 504].includes(response.status)) throw error;
        const waitMs = retryAfter ? Math.min(Number(retryAfter) * 1000, 30000) : Math.min(250 * 2 ** attempt + Math.floor(Math.random() * 150), 5000);
        await new Promise(resolve => setTimeout(resolve, waitMs));
        lastError = error;
      } catch (error) {
        if (error instanceof SquareApiError) throw error;
        if (!retryableMethod || attempt >= this.config.maxRetries) throw error;
        lastError = error;
        await new Promise(resolve => setTimeout(resolve, Math.min(250 * 2 ** attempt, 5000)));
      } finally {
        clearTimeout(timer);
        options.signal?.removeEventListener('abort', abort);
      }
    }
    throw lastError instanceof Error ? lastError : new Error('Square API request failed');
  }
}
