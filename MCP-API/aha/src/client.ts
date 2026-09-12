import type { Config } from './config.js';

export class AhaError extends Error {
  constructor(message: string, public readonly status?: number, public readonly retryAfterMs?: number) {
    super(message);
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT';
  query?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  retryWrites?: boolean;
};

export class AhaClient {
  private readonly baseUrl: string;
  constructor(private readonly config: Config, private readonly fetchImpl: typeof fetch = fetch) {
    this.baseUrl = `https://${config.accountDomain}/api/v1`;
  }

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const method = options.method ?? 'GET';
    const url = new URL(`${this.baseUrl}${path}`);
    for (const [key, value] of Object.entries(options.query ?? {})) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
    const retryable = method === 'GET' || options.retryWrites === true;
    let lastError: unknown;
    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const response = await this.fetchImpl(url, {
          method,
          headers: {
            Authorization: `Bearer ${this.config.accessToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'User-Agent': this.config.userAgent
          },
          body: options.body === undefined ? undefined : JSON.stringify(options.body),
          signal: controller.signal
        });
        const text = await response.text();
        const payload = text ? safeJson(text) : {};
        if (response.ok) return payload as T;
        const reset = Number(response.headers.get('x-ratelimit-reset'));
        const retryAfterMs = response.status === 429 && Number.isFinite(reset)
          ? Math.max(0, reset * 1000 - Date.now())
          : undefined;
        if (response.status === 429 && retryable && attempt < this.config.maxRetries) {
          await sleep(Math.min(retryAfterMs ?? 1000 * 2 ** attempt, 10000));
          continue;
        }
        if (response.status >= 500 && retryable && attempt < this.config.maxRetries) {
          await sleep(250 * 2 ** attempt);
          continue;
        }
        throw new AhaError(`Aha! API ${response.status}: ${extractMessage(payload)}`, response.status, retryAfterMs);
      } catch (error) {
        lastError = error;
        if (error instanceof AhaError) throw error;
        if (!retryable || attempt >= this.config.maxRetries) {
          if (error instanceof Error && error.name === 'AbortError') throw new AhaError('Aha! API request timed out');
          throw new AhaError(`Aha! API network error: ${error instanceof Error ? error.message : String(error)}`);
        }
        await sleep(250 * 2 ** attempt);
      } finally {
        clearTimeout(timer);
      }
    }
    throw lastError instanceof Error ? lastError : new AhaError('Aha! API request failed');
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const safeJson = (text: string): unknown => { try { return JSON.parse(text); } catch { return { raw: text }; } };
const extractMessage = (payload: unknown): string => {
  if (payload && typeof payload === 'object') {
    const p = payload as Record<string, unknown>;
    if (typeof p.error === 'string') return p.error;
    if (typeof p.message === 'string') return p.message;
    if (Array.isArray(p.errors)) return p.errors.map(String).join('; ');
  }
  return 'request failed';
};
