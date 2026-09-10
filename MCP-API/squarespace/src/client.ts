import type { SquarespaceConfig } from './config.js';

export class SquarespaceError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly retryAfterSeconds?: number,
    public readonly providerBody?: unknown
  ) {
    super(message);
  }
}

export class SquarespaceClient {
  constructor(private readonly config: SquarespaceConfig, private readonly fetchImpl: typeof fetch = fetch) {}

  async request<T>(method: string, path: string, options: {
    query?: Record<string, string | number | boolean | undefined>;
    body?: unknown;
    headers?: Record<string, string>;
    retryable?: boolean;
  } = {}): Promise<T> {
    if (!path.startsWith('/') || path.startsWith('//')) throw new Error('Provider path must be relative to the fixed Squarespace origin');
    const url = new URL(path, this.config.baseUrl);
    for (const [key, value] of Object.entries(options.query ?? {})) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }

    const retryable = options.retryable ?? method === 'GET';
    const attempts = retryable ? this.config.maxRetries + 1 : 1;
    let lastError: unknown;

    for (let attempt = 0; attempt < attempts; attempt++) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const response = await this.fetchImpl(url, {
          method,
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${this.config.token}`,
            'User-Agent': this.config.userAgent,
            Accept: 'application/json',
            ...(options.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
            ...options.headers
          },
          body: options.body === undefined ? undefined : JSON.stringify(options.body)
        });
        clearTimeout(timeout);

        if (response.ok) {
          if (response.status === 204) return { ok: true } as T;
          const text = await response.text();
          return (text ? JSON.parse(text) : { ok: true }) as T;
        }

        const retryAfter = this.parseRetryAfter(response.headers.get('retry-after'));
        const text = await response.text();
        let body: unknown = text;
        try { body = text ? JSON.parse(text) : undefined; } catch { /* keep text */ }
        const error = new SquarespaceError(`Squarespace API request failed with HTTP ${response.status}`, response.status, retryAfter, body);
        if (!retryable || attempt + 1 >= attempts || !this.isTransientStatus(response.status)) throw error;
        await this.delay(retryAfter ?? Math.min(4, 2 ** attempt));
      } catch (error) {
        clearTimeout(timeout);
        if (error instanceof SquarespaceError) throw error;
        lastError = error;
        if (!retryable || attempt + 1 >= attempts) {
          if ((error as Error)?.name === 'AbortError') throw new SquarespaceError(`Squarespace request timed out after ${this.config.timeoutMs}ms`);
          throw new SquarespaceError('Squarespace network request failed');
        }
        await this.delay(Math.min(4, 2 ** attempt));
      }
    }
    throw lastError instanceof Error ? lastError : new Error('Squarespace request failed');
  }

  private isTransientStatus(status: number): boolean {
    return status === 429 || status === 502 || status === 503 || status === 504;
  }

  private parseRetryAfter(value: string | null): number | undefined {
    if (!value) return undefined;
    const seconds = Number(value);
    if (Number.isFinite(seconds) && seconds >= 0) return Math.min(seconds, 60);
    const date = Date.parse(value);
    if (!Number.isNaN(date)) return Math.min(Math.max(0, Math.ceil((date - Date.now()) / 1000)), 60);
    return undefined;
  }

  private async delay(seconds: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, Math.max(0, seconds) * 1000));
  }
}
