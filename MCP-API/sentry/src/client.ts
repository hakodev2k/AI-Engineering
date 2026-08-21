import type { ConnectorConfig } from './config.js';

type RequestOptions = { query?: Record<string, string | number | boolean | string[] | undefined>; body?: unknown; retryable?: boolean };

export class SentryClient {
  constructor(private readonly cfg: ConnectorConfig, private readonly fetchImpl: typeof fetch = fetch) {}

  async request(method: 'GET' | 'POST' | 'PUT', path: string, options: RequestOptions = {}): Promise<unknown> {
    const url = new URL(`${this.cfg.baseUrl}/api/0${path}`);
    for (const [key, raw] of Object.entries(options.query || {})) {
      if (raw === undefined) continue;
      for (const value of Array.isArray(raw) ? raw : [raw]) url.searchParams.append(key, String(value));
    }

    const retryable = options.retryable ?? method === 'GET';
    let lastError: Error | undefined;
    for (let attempt = 0; attempt <= this.cfg.maxRetries; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.cfg.timeoutMs);
      try {
        const response = await this.fetchImpl(url, {
          method,
          headers: {
            Authorization: `Bearer ${this.cfg.token}`,
            Accept: 'application/json',
            ...(options.body === undefined ? {} : { 'Content-Type': 'application/json' })
          },
          body: options.body === undefined ? undefined : JSON.stringify(options.body),
          signal: controller.signal
        });
        const text = await response.text();
        const payload = text ? safeJson(text) : null;
        if (response.ok) return { data: payload, pagination: parsePagination(response.headers), rateLimit: parseRateLimit(response.headers) };

        const error = new Error(`Sentry API ${response.status}: ${extractMessage(payload)}`);
        if (!retryable || ![408, 429, 500, 502, 503, 504].includes(response.status) || attempt === this.cfg.maxRetries) throw error;
        const retryAfter = Number(response.headers.get('retry-after'));
        const reset = Number(response.headers.get('x-sentry-rate-limit-reset'));
        const delay = Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : Number.isFinite(reset) && reset * 1000 > Date.now() ? Math.min(reset * 1000 - Date.now(), 30000) : Math.min(500 * 2 ** attempt, 5000);
        await new Promise(resolve => setTimeout(resolve, delay));
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        if (!retryable || attempt === this.cfg.maxRetries || /Sentry API (400|401|403|404)/.test(lastError.message)) throw lastError;
        await new Promise(resolve => setTimeout(resolve, Math.min(500 * 2 ** attempt, 5000)));
      } finally {
        clearTimeout(timer);
      }
    }
    throw lastError ?? new Error('Sentry request failed.');
  }
}

function safeJson(value: string): unknown { try { return JSON.parse(value); } catch { return { raw: value.slice(0, 10000) }; } }
function extractMessage(value: unknown): string { return typeof value === 'object' && value && 'detail' in value ? String((value as { detail?: unknown }).detail) : 'request failed'; }
function parsePagination(headers: Headers) { return { link: headers.get('link') }; }
function parseRateLimit(headers: Headers) { return { limit: headers.get('x-sentry-rate-limit-limit'), remaining: headers.get('x-sentry-rate-limit-remaining'), reset: headers.get('x-sentry-rate-limit-reset'), concurrentLimit: headers.get('x-sentry-rate-limit-concurrentlimit'), concurrentRemaining: headers.get('x-sentry-rate-limit-concurrentremaining') }; }
