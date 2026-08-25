import type { CalendlyConfig } from './config.js';

export class CalendlyRestClient {
  constructor(private readonly config: CalendlyConfig) {}

  async request<T>(method: string, path: string, options: { query?: Record<string, string | number | boolean | undefined>; body?: unknown; signal?: AbortSignal; retryable?: boolean } = {}): Promise<T> {
    if (!this.config.CALENDLY_API_TOKEN) throw new Error('REST transport requires CALENDLY_API_TOKEN');
    const url = new URL(path, this.config.CALENDLY_API_BASE_URL);
    for (const [k, v] of Object.entries(options.query ?? {})) if (v !== undefined) url.searchParams.set(k, String(v));
    const max = options.retryable === false ? 0 : this.config.CALENDLY_MAX_RETRIES;
    let last: unknown;
    for (let attempt = 0; attempt <= max; attempt++) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), this.config.CALENDLY_TIMEOUT_MS);
      const onAbort = () => controller.abort();
      options.signal?.addEventListener('abort', onAbort, { once: true });
      try {
        const response = await fetch(url, {
          method,
          headers: {
            Authorization: `Bearer ${this.config.CALENDLY_API_TOKEN}`,
            Accept: 'application/json',
            ...(options.body === undefined ? {} : { 'Content-Type': 'application/json' })
          },
          body: options.body === undefined ? undefined : JSON.stringify(options.body),
          signal: controller.signal
        });
        const text = await response.text();
        const data = text ? JSON.parse(text) : undefined;
        if (response.ok) return data as T;
        const err = new Error(`Calendly API ${response.status}: ${text.slice(0, 1000)}`);
        if (![408, 429, 500, 502, 503, 504].includes(response.status) || attempt === max) throw err;
        const retryAfter = Number(response.headers.get('retry-after'));
        await sleep(Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : Math.min(500 * 2 ** attempt, 5000));
        last = err;
      } catch (error) {
        if (options.signal?.aborted) throw new Error('Request cancelled');
        if (attempt === max || error instanceof SyntaxError) throw error;
        last = error;
        await sleep(Math.min(500 * 2 ** attempt, 5000));
      } finally {
        clearTimeout(timeout);
        options.signal?.removeEventListener('abort', onAbort);
      }
    }
    throw last instanceof Error ? last : new Error('Calendly request failed');
  }
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
