import type { BunnyConfig } from './config.js';
import { StaticCredentialProvider, type CredentialProvider } from './auth/credentials.js';

export class BunnyApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly retryAfterSeconds?: number,
    public readonly body?: unknown,
  ) {
    super(message);
    this.name = 'BunnyApiError';
  }
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  query?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  signal?: AbortSignal;
}

export interface ApiResult<T = unknown> {
  data: T;
  rateLimit?: { limit?: number; remaining?: number };
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class BunnyClient {
  private readonly credentials: CredentialProvider;

  constructor(
    private readonly config: BunnyConfig,
    private readonly fetchImpl: typeof fetch = fetch,
    credentials?: CredentialProvider,
  ) {
    this.credentials = credentials ?? new StaticCredentialProvider(config.apiKey);
  }

  async request<T>(path: string, options: RequestOptions = {}): Promise<ApiResult<T>> {
    if (!path.startsWith('/') || path.includes('://') || path.includes('\\')) {
      throw new Error('Provider path must be a relative bunny.net API path.');
    }

    const method = options.method ?? 'GET';
    const maxAttempts = method === 'GET' ? this.config.maxRetries + 1 : 1;
    let lastError: unknown;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        return await this.requestOnce<T>(path, options);
      } catch (error) {
        lastError = error;
        if (!this.shouldRetry(error, method) || attempt === maxAttempts - 1) throw error;
        const retryAfter = error instanceof BunnyApiError ? error.retryAfterSeconds : undefined;
        const delayMs = retryAfter != null
          ? Math.min(retryAfter * 1000, 30000)
          : Math.min(250 * 2 ** attempt + Math.floor(Math.random() * 100), 5000);
        await sleep(delayMs);
      }
    }

    throw lastError;
  }

  private async requestOnce<T>(path: string, options: RequestOptions): Promise<ApiResult<T>> {
    const url = new URL(path, this.config.apiBaseUrl);
    for (const [key, value] of Object.entries(options.query ?? {})) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }

    const timeout = AbortSignal.timeout(this.config.timeoutMs);
    const signal = options.signal ? AbortSignal.any([options.signal, timeout]) : timeout;
    let response: Response;
    try {
      response = await this.fetchImpl(url, {
        method: options.method ?? 'GET',
        headers: {
          AccessKey: this.credentials.getAccessKey(),
          Accept: 'application/json',
          ...(options.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        },
        body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
        signal,
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'TimeoutError') {
        throw new BunnyApiError('bunny.net API request timed out.', 408);
      }
      throw error;
    }

    const retryAfterHeader = response.headers.get('retry-after');
    const retryAfterSeconds = retryAfterHeader && /^\d+$/.test(retryAfterHeader)
      ? Number(retryAfterHeader)
      : undefined;
    const limitHeader = response.headers.get('x-ratelimit-limit');
    const remainingHeader = response.headers.get('x-ratelimit-remaining');

    const text = await response.text();
    let parsed: unknown = undefined;
    if (text) {
      try { parsed = JSON.parse(text); } catch { parsed = text; }
    }

    if (!response.ok) {
      const providerMessage = typeof parsed === 'object' && parsed && 'Message' in parsed
        ? String((parsed as { Message?: unknown }).Message)
        : response.statusText;
      throw new BunnyApiError(
        `bunny.net API ${response.status}: ${providerMessage || 'request failed'}`,
        response.status,
        retryAfterSeconds,
        parsed,
      );
    }

    return {
      data: parsed as T,
      rateLimit: {
        limit: limitHeader && /^\d+$/.test(limitHeader) ? Number(limitHeader) : undefined,
        remaining: remainingHeader && /^\d+$/.test(remainingHeader) ? Number(remainingHeader) : undefined,
      },
    };
  }

  private shouldRetry(error: unknown, method: string): boolean {
    if (method !== 'GET') return false;
    if (error instanceof BunnyApiError) {
      return error.status === 429 || error.status === 408 || error.status >= 500;
    }
    return error instanceof TypeError;
  }
}
