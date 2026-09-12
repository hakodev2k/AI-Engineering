import type { GongConfig } from './config.js';

export class GongApiError extends Error {
  constructor(public readonly status: number, message: string, public readonly retryAfterSeconds?: number) {
    super(message);
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class GongClient {
  constructor(private readonly config: GongConfig, private readonly fetchImpl: typeof fetch = fetch) {}

  private authHeader(): string {
    if (this.config.oauthAccessToken) return `Bearer ${this.config.oauthAccessToken}`;
    return `Basic ${Buffer.from(`${this.config.accessKey}:${this.config.accessKeySecret}`).toString('base64')}`;
  }

  async request(method: 'GET' | 'POST' | 'PUT', path: string, options: {
    query?: Record<string, string | number | boolean | undefined>;
    body?: unknown;
    retryable?: boolean;
    signal?: AbortSignal;
  } = {}): Promise<unknown> {
    const url = new URL(path, this.config.apiBaseUrl);
    for (const [key, value] of Object.entries(options.query ?? {})) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
    const attempts = options.retryable === false ? 1 : this.config.maxRetries + 1;
    let lastError: unknown;
    for (let attempt = 0; attempt < attempts; attempt++) {
      const timeout = AbortSignal.timeout(this.config.timeoutMs);
      const signal = options.signal ? AbortSignal.any([options.signal, timeout]) : timeout;
      try {
        const response = await this.fetchImpl(url, {
          method,
          signal,
          headers: {
            Authorization: this.authHeader(),
            Accept: 'application/json',
            ...(options.body === undefined ? {} : { 'Content-Type': 'application/json' })
          },
          body: options.body === undefined ? undefined : JSON.stringify(options.body)
        });
        const text = await response.text();
        const payload = text ? JSON.parse(text) : {};
        if (response.ok) return payload;
        const retryAfter = Number(response.headers.get('Retry-After') || '') || undefined;
        const message = Array.isArray(payload?.errors) ? payload.errors.slice(0, 3).join('; ') : `Gong API request failed with HTTP ${response.status}`;
        const error = new GongApiError(response.status, message, retryAfter);
        if (![429, 502, 503, 504].includes(response.status) || attempt === attempts - 1) throw error;
        await sleep(Math.min(30000, (retryAfter ?? 2 ** attempt) * 1000));
      } catch (error) {
        lastError = error;
        if (error instanceof GongApiError) throw error;
        if (attempt === attempts - 1) throw error;
        await sleep(Math.min(5000, 250 * 2 ** attempt));
      }
    }
    throw lastError instanceof Error ? lastError : new Error('Gong request failed');
  }

  get(path: string, query?: Record<string, string | number | boolean | undefined>) { return this.request('GET', path, { query }); }
  post(path: string, body: unknown) { return this.request('POST', path, { body }); }
  put(path: string, body: unknown) { return this.request('PUT', path, { body, retryable: false }); }
}
