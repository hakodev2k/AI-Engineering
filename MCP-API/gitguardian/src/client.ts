import type { Config } from './config.js';

export class GitGuardianError extends Error {
  constructor(public status: number, message: string, public retryAfter?: number) { super(message); }
}

export class GitGuardianClient {
  constructor(private config: Config, private fetchFn: typeof fetch = fetch) {}

  async request<T>(method: string, path: string, options: { query?: Record<string, string | number | boolean | undefined>; body?: unknown; signal?: AbortSignal; retryable?: boolean } = {}): Promise<T> {
    const url = new URL(this.config.baseUrl + path);
    for (const [k, v] of Object.entries(options.query || {})) if (v !== undefined) url.searchParams.set(k, String(v));
    const retryable = options.retryable ?? method === 'GET';
    for (let attempt = 0; ; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      const signal = options.signal ? AbortSignal.any([options.signal, controller.signal]) : controller.signal;
      try {
        const res = await this.fetchFn(url, {
          method,
          signal,
          headers: {
            Authorization: `Token ${this.config.apiKey}`,
            Accept: 'application/json',
            ...(options.body ? { 'Content-Type': 'application/json' } : {})
          },
          body: options.body ? JSON.stringify(options.body) : undefined
        });
        if (res.ok) return (res.status === 204 ? undefined : await res.json()) as T;
        const retryAfter = parseRetryAfter(res.headers.get('retry-after'));
        const text = await res.text();
        const err = new GitGuardianError(res.status, safeMessage(text, res.status), retryAfter);
        if (!shouldRetry(res.status, retryable, attempt, this.config.maxRetries)) throw err;
        await delay(retryAfter ? retryAfter * 1000 : Math.min(8000, 500 * 2 ** attempt));
      } catch (error) {
        if (error instanceof GitGuardianError) throw error;
        if (!retryable || attempt >= this.config.maxRetries || options.signal?.aborted) throw error;
        await delay(Math.min(8000, 500 * 2 ** attempt));
      } finally { clearTimeout(timer); }
    }
  }
}

function shouldRetry(status: number, retryable: boolean, attempt: number, max: number) {
  return retryable && attempt < max && (status === 429 || status === 502 || status === 503 || status === 504);
}
function parseRetryAfter(v: string | null) { const n = v ? Number(v) : NaN; return Number.isFinite(n) && n >= 0 ? n : undefined; }
function delay(ms: number) { return new Promise(resolve => setTimeout(resolve, ms)); }
function safeMessage(text: string, status: number) {
  try { const data = JSON.parse(text); return data.detail || data.message || `GitGuardian API error ${status}`; } catch { return `GitGuardian API error ${status}`; }
}
