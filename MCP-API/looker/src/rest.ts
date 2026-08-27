import type { Config } from './config.js';

export class LookerError extends Error {
  constructor(public status: number, message: string, public retryAfter?: number) { super(message); }
}

export class LookerRestClient {
  private token?: { value: string; expiresAt: number };
  constructor(private config: Config, private fetchImpl: typeof fetch = fetch) {}

  private async accessToken(signal?: AbortSignal) {
    if (this.token && Date.now() < this.token.expiresAt - 30_000) return this.token.value;
    if (!this.config.clientId || !this.config.clientSecret) throw new Error('REST fallback requires LOOKER_CLIENT_ID and LOOKER_CLIENT_SECRET');
    const body = new URLSearchParams({ client_id: this.config.clientId, client_secret: this.config.clientSecret });
    const r = await this.fetchImpl(`${this.config.baseUrl}/api/4.0/login`, { method: 'POST', body, signal });
    if (!r.ok) throw new LookerError(r.status, `Looker login failed: ${r.status}`);
    const j = await r.json() as { access_token: string; expires_in?: number };
    this.token = { value: j.access_token, expiresAt: Date.now() + (j.expires_in ?? 3600) * 1000 };
    return j.access_token;
  }

  async request<T>(method: string, path: string, opts: { query?: Record<string, string | number | boolean | undefined>; body?: unknown; retryable?: boolean; signal?: AbortSignal } = {}): Promise<T> {
    const url = new URL(`${this.config.baseUrl}/api/4.0${path}`);
    for (const [k, v] of Object.entries(opts.query ?? {})) if (v !== undefined) url.searchParams.set(k, String(v));
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.config.timeoutMs);
    if (opts.signal) opts.signal.addEventListener('abort', () => controller.abort(), { once: true });
    try {
      for (let attempt = 0; ; attempt++) {
        const token = await this.accessToken(controller.signal);
        const r = await this.fetchImpl(url, {
          method,
          headers: { Authorization: `token ${token}`, ...(opts.body === undefined ? {} : { 'Content-Type': 'application/json' }) },
          body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
          signal: controller.signal
        });
        if (r.status === 401) this.token = undefined;
        const retryAfter = Number(r.headers.get('retry-after') ?? 0) || undefined;
        if ((r.status === 429 || r.status >= 500) && opts.retryable !== false && attempt < this.config.maxRetries) {
          const delay = retryAfter ? retryAfter * 1000 : Math.min(500 * 2 ** attempt, 5000);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        if (!r.ok) {
          let detail = '';
          try { detail = JSON.stringify(await r.json()); } catch { detail = await r.text(); }
          throw new LookerError(r.status, `Looker API ${r.status}: ${detail.slice(0, 1000)}`, retryAfter);
        }
        if (r.status === 204) return undefined as T;
        return await r.json() as T;
      }
    } finally { clearTimeout(timeout); }
  }
}
