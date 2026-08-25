import type { Config } from './config.js';

export class PlaidError extends Error {
  constructor(
    message: string,
    public status: number,
    public errorType?: string,
    public errorCode?: string,
    public requestId?: string,
    public retryAfterMs?: number
  ) { super(message); }
}

const RETRYABLE_STATUS = new Set([408, 429, 500, 502, 503, 504]);
const sleep = (ms: number, signal?: AbortSignal) => new Promise<void>((resolve, reject) => {
  const timer = setTimeout(resolve, ms);
  signal?.addEventListener('abort', () => { clearTimeout(timer); reject(signal.reason ?? new Error('Aborted')); }, { once: true });
});

export class PlaidClient {
  constructor(private readonly config: Config, private readonly fetchImpl: typeof fetch = fetch) {}

  async post<T>(path: string, body: Record<string, unknown>, signal?: AbortSignal, retrySafe = true): Promise<T> {
    if (!path.startsWith('/') || path.includes('..')) throw new Error('Invalid Plaid path');
    for (let attempt = 0; ; attempt++) {
      const timeout = AbortSignal.timeout(this.config.timeoutMs);
      const combined = signal ? AbortSignal.any([signal, timeout]) : timeout;
      try {
        const response = await this.fetchImpl(`${this.config.baseUrl}${path}`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ client_id: this.config.clientId, secret: this.config.secret, ...body }),
          signal: combined
        });
        const json = await response.json() as any;
        if (response.ok && !json?.error_type) return json as T;
        const retryAfter = response.headers.get('retry-after');
        const retryAfterMs = retryAfter && Number.isFinite(Number(retryAfter)) ? Number(retryAfter) * 1000 : undefined;
        const err = new PlaidError(
          json?.error_message || `Plaid request failed with HTTP ${response.status}`,
          response.status,
          json?.error_type,
          json?.error_code,
          json?.request_id,
          retryAfterMs
        );
        const appRateLimit = json?.error_type === 'RATE_LIMIT_EXCEEDED';
        const canRetry = retrySafe && attempt < this.config.maxRetries && (RETRYABLE_STATUS.has(response.status) || appRateLimit);
        if (!canRetry) throw err;
        await sleep(Math.min(retryAfterMs ?? 250 * (2 ** attempt), 5000), signal);
      } catch (error) {
        if (error instanceof PlaidError) throw error;
        if (!retrySafe || attempt >= this.config.maxRetries || signal?.aborted) throw error;
        await sleep(Math.min(250 * (2 ** attempt), 5000), signal);
      }
    }
  }
}
