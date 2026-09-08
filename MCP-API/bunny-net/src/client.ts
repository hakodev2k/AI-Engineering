import { config } from './config.js';

export class BunnyError extends Error {
  constructor(message: string, public status?: number, public code?: string, public retryAfterMs?: number) { super(message); }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export class BunnyClient {
  constructor(
    private key = config.apiKey,
    private baseUrl = config.baseUrl,
    private timeoutMs = config.timeoutMs,
    private maxRetries = config.maxRetries,
    private fetchImpl: typeof fetch = fetch,
  ) {
    if (!key) throw new BunnyError('BUNNY_API_KEY is required', 401, 'missing_api_key');
    const u = new URL(baseUrl);
    if (u.protocol !== 'https:') throw new BunnyError('BUNNY_API_BASE_URL must use HTTPS', 400, 'invalid_base_url');
  }

  async request<T>(method: string, path: string, body?: unknown, retrySafe = ['GET', 'HEAD'].includes(method.toUpperCase())): Promise<T> {
    const base = this.baseUrl.endsWith('/') ? this.baseUrl : `${this.baseUrl}/`;
    const url = new URL(path.replace(/^\//, ''), base);
    if (url.origin !== new URL(base).origin) throw new BunnyError('Cross-origin requests are forbidden', 400, 'ssrf_blocked');
    let attempt = 0;
    while (true) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeoutMs);
      try {
        const response = await this.fetchImpl(url, {
          method,
          headers: { Accept: 'application/json', AccessKey: this.key, ...(body === undefined ? {} : { 'Content-Type': 'application/json' }) },
          body: body === undefined ? undefined : JSON.stringify(body),
          signal: controller.signal,
        });
        const text = await response.text();
        const data = text ? (() => { try { return JSON.parse(text); } catch { return text; } })() : null;
        const retryAfter = Number(response.headers.get('Retry-After') ?? '');
        const retryAfterMs = Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : undefined;
        if (!response.ok) {
          const message = typeof data === 'object' && data && 'Message' in data ? String((data as Record<string, unknown>).Message) : `bunny.net API ${response.status}`;
          if (retrySafe && attempt < this.maxRetries && (response.status === 429 || response.status >= 500)) {
            await sleep(retryAfterMs ?? Math.min(500 * 2 ** attempt, 5000));
            attempt += 1;
            continue;
          }
          throw new BunnyError(message, response.status, response.status === 429 ? 'rate_limited' : 'provider_error', retryAfterMs);
        }
        return data as T;
      } catch (error) {
        if (error instanceof BunnyError) throw error;
        if (error instanceof Error && error.name === 'AbortError') throw new BunnyError('bunny.net request timed out', 504, 'timeout');
        if (retrySafe && attempt < this.maxRetries) {
          await sleep(Math.min(500 * 2 ** attempt, 5000));
          attempt += 1;
          continue;
        }
        throw new BunnyError(error instanceof Error ? error.message : 'network failure', 503, 'network_error');
      } finally { clearTimeout(timer); }
    }
  }
}
