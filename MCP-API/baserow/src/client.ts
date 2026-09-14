import type { Config } from './config.js';

export class BaserowError extends Error {
  constructor(message: string, public readonly status?: number, public readonly retryAfterSeconds?: number) {
    super(message);
  }
}

function retryAfter(headers: Headers): number | undefined {
  const raw = headers.get('retry-after');
  if (!raw) return undefined;
  const numeric = Number(raw);
  if (Number.isFinite(numeric) && numeric >= 0) return Math.ceil(numeric);
  const date = Date.parse(raw);
  if (Number.isNaN(date)) return undefined;
  return Math.max(0, Math.ceil((date - Date.now()) / 1000));
}

export class BaserowClient {
  constructor(private readonly config: Config, private readonly fetchImpl: typeof fetch = fetch) {}

  async request<T>(method: string, path: string, opts: { query?: Record<string, string | number | boolean | undefined>; body?: unknown; retryable?: boolean } = {}): Promise<T> {
    const url = new URL(path, this.config.baseUrl);
    for (const [key, value] of Object.entries(opts.query ?? {})) if (value !== undefined) url.searchParams.set(key, String(value));
    const attempts = opts.retryable === false ? 1 : this.config.maxRetries + 1;
    let last: unknown;
    for (let attempt = 0; attempt < attempts; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const response = await this.fetchImpl(url, {
          method,
          redirect: 'error',
          signal: controller.signal,
          headers: {
            Authorization: `Token ${this.config.token}`,
            Accept: 'application/json',
            ...(opts.body === undefined ? {} : { 'Content-Type': 'application/json' })
          },
          body: opts.body === undefined ? undefined : JSON.stringify(opts.body)
        });
        if (response.ok) {
          if (response.status === 204) return undefined as T;
          return await response.json() as T;
        }
        const delay = retryAfter(response.headers);
        const text = (await response.text()).slice(0, 2048);
        const err = new BaserowError(`Baserow API ${response.status}: ${text || response.statusText}`, response.status, delay);
        if ((response.status === 429 || response.status >= 500) && attempt + 1 < attempts) {
          await new Promise(resolve => setTimeout(resolve, Math.min(5000, delay !== undefined ? delay * 1000 : 250 * 2 ** attempt)));
          last = err;
          continue;
        }
        throw err;
      } catch (error) {
        last = error;
        if (error instanceof BaserowError) throw error;
        if (attempt + 1 >= attempts) {
          if ((error as { name?: string }).name === 'AbortError') throw new BaserowError(`Baserow request timed out after ${this.config.timeoutMs}ms`);
          throw new BaserowError(`Baserow network error: ${error instanceof Error ? error.message : String(error)}`);
        }
        await new Promise(resolve => setTimeout(resolve, 250 * 2 ** attempt));
      } finally {
        clearTimeout(timer);
      }
    }
    throw last instanceof Error ? last : new BaserowError('Baserow request failed');
  }
}
