import type { ConnectorConfig } from './config.js';

export class ProviderError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly retryAfterSeconds?: number,
    public readonly body?: unknown
  ) {
    super(message);
    this.name = 'ProviderError';
  }
}

type Json = Record<string, unknown> | unknown[] | string | number | boolean | null;

interface TokenState {
  accessToken: string;
  expiresAtMs: number;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class SolarWindsIncidentResponseClient {
  private token?: TokenState;

  constructor(
    private readonly config: ConnectorConfig,
    private readonly fetchImpl: typeof fetch = fetch
  ) {}

  private async getAccessToken(signal?: AbortSignal): Promise<string> {
    const now = Date.now();
    if (this.token && now < this.token.expiresAtMs - 60_000) return this.token.accessToken;

    const response = await this.fetchImpl(this.config.authUrl, {
      method: 'GET',
      headers: { 'X-Refresh-Token': this.config.refreshToken, Accept: 'application/json' },
      signal
    });
    const body = await this.safeJson(response);
    if (!response.ok) throw this.toError(response, body, 'Authentication failed');

    const data = (body as any)?.data;
    if (!data?.access_token) throw new ProviderError('Authentication response did not contain access_token', 502, undefined, body);
    const expiresAtSeconds = Number(data.expires_at || 0);
    this.token = {
      accessToken: String(data.access_token),
      expiresAtMs: expiresAtSeconds > 0 ? expiresAtSeconds * 1000 : now + 5 * 60_000
    };
    return this.token.accessToken;
  }

  private async safeJson(response: Response): Promise<Json | undefined> {
    if (response.status === 204) return undefined;
    const text = await response.text();
    if (!text) return undefined;
    try { return JSON.parse(text) as Json; } catch { return { raw: text }; }
  }

  private toError(response: Response, body: unknown, fallback: string): ProviderError {
    const retryAfter = response.headers.get('retry-after');
    const retryAfterSeconds = retryAfter && /^\d+$/.test(retryAfter) ? Number(retryAfter) : undefined;
    const providerMessage = (body as any)?.meta?.message ?? (body as any)?.message ?? fallback;
    return new ProviderError(String(providerMessage), response.status, retryAfterSeconds, body);
  }

  private buildUrl(path: string, query?: Record<string, string | number | boolean | undefined>): string {
    if (!path.startsWith('/')) throw new Error('Provider path must begin with /');
    const url = new URL(path, this.config.apiBaseUrl);
    for (const [key, value] of Object.entries(query ?? {})) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
    return url.toString();
  }

  async request(
    method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE',
    path: string,
    options: {
      query?: Record<string, string | number | boolean | undefined>;
      body?: unknown;
      retrySafe?: boolean;
      signal?: AbortSignal;
    } = {}
  ): Promise<unknown> {
    const maxAttempts = (options.retrySafe ?? method === 'GET') ? this.config.maxRetries + 1 : 1;
    let lastError: unknown;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(new Error('provider request timed out')), this.config.timeoutMs);
      const parentAbort = () => controller.abort(options.signal?.reason);
      options.signal?.addEventListener('abort', parentAbort, { once: true });

      try {
        const token = await this.getAccessToken(controller.signal);
        const response = await this.fetchImpl(this.buildUrl(path, options.query), {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            ...(options.body === undefined ? {} : { 'Content-Type': 'application/json' })
          },
          body: options.body === undefined ? undefined : JSON.stringify(options.body),
          signal: controller.signal
        });
        const body = await this.safeJson(response);
        if (response.ok) return body ?? {};

        const error = this.toError(response, body, `Provider returned HTTP ${response.status}`);
        if (response.status === 401) this.token = undefined;
        const retryable = options.retrySafe !== false && (response.status === 429 || response.status >= 500);
        if (!retryable || attempt === maxAttempts) throw error;
        const delayMs = error.retryAfterSeconds !== undefined
          ? Math.min(error.retryAfterSeconds * 1000, 30_000)
          : Math.min(250 * 2 ** (attempt - 1), 4000);
        await sleep(delayMs);
      } catch (error) {
        lastError = error;
        if (error instanceof ProviderError) {
          if (attempt === maxAttempts || !(error.status === 429 || error.status >= 500)) throw error;
        } else if (attempt === maxAttempts) {
          throw error;
        }
        await sleep(Math.min(250 * 2 ** (attempt - 1), 4000));
      } finally {
        clearTimeout(timeout);
        options.signal?.removeEventListener('abort', parentAbort);
      }
    }

    throw lastError instanceof Error ? lastError : new Error('Provider request failed');
  }

  get(path: string, query?: Record<string, string | number | boolean | undefined>, signal?: AbortSignal) {
    return this.request('GET', path, { query, retrySafe: true, signal });
  }

  post(path: string, body?: unknown, signal?: AbortSignal) {
    return this.request('POST', path, { body, retrySafe: false, signal });
  }

  patch(path: string, body?: unknown, signal?: AbortSignal) {
    return this.request('PATCH', path, { body, retrySafe: false, signal });
  }
}
