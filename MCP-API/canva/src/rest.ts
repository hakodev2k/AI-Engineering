import type { CanvaConfig } from './config.js';
import type { CanvaCredentialProvider } from './auth.js';

export class CanvaApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code?: string,
    public readonly retryAfterMs?: number,
  ) {
    super(message);
    this.name = 'CanvaApiError';
  }
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class CanvaRestClient {
  constructor(
    private readonly config: CanvaConfig,
    private readonly credentials: CanvaCredentialProvider,
    private readonly fetchImpl: typeof fetch = fetch,
  ) {}

  async request<T>(
    method: string,
    path: string,
    options: {
      query?: Record<string, string | number | boolean | undefined>;
      body?: unknown;
      retry?: boolean;
    } = {},
  ): Promise<T> {
    const url = new URL(this.config.apiBaseUrl + path);
    for (const [key, value] of Object.entries(options.query ?? {})) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
    const retryable = options.retry ?? method === 'GET';
    let refreshed401 = false;

    for (let attempt = 0; ; attempt++) {
      const token = await this.credentials.getAccessToken();
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const response = await this.fetchImpl(url, {
          method,
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            ...(options.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
          },
          body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
        });
        const raw = await response.text();
        let data: any = undefined;
        if (raw) {
          try { data = JSON.parse(raw); } catch { data = { message: raw }; }
        }

        if (response.ok) return data as T;
        if (response.status === 401 && !refreshed401 && this.config.refreshToken) {
          refreshed401 = true;
          this.credentials.invalidateAccessToken();
          continue;
        }

        const retryAfter = response.headers.get('retry-after');
        const retryAfterMs = retryAfter ? Math.max(0, Number(retryAfter) * 1000) : undefined;
        if ((response.status === 429 || response.status >= 500) && retryable && attempt < this.config.maxRetries) {
          await sleep(Math.min(retryAfterMs ?? 250 * (2 ** attempt), 10_000));
          continue;
        }
        throw new CanvaApiError(
          response.status,
          data?.message ?? `Canva API HTTP ${response.status}`,
          data?.code,
          retryAfterMs,
        );
      } catch (error) {
        if (error instanceof CanvaApiError) throw error;
        if ((error as Error).name === 'AbortError') {
          if (retryable && attempt < this.config.maxRetries) {
            await sleep(250 * (2 ** attempt));
            continue;
          }
          throw new Error('Canva API request timed out');
        }
        if (retryable && attempt < this.config.maxRetries) {
          await sleep(250 * (2 ** attempt));
          continue;
        }
        throw error;
      } finally {
        clearTimeout(timer);
      }
    }
  }
}
