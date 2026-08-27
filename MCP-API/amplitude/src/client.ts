import type { Config } from './config.js';

export class AmplitudeError extends Error {
  constructor(public status: number, message: string, public retryAfter?: number, public body?: unknown) { super(message); }
}

type QueryValue = string | number | boolean | undefined;
const sleep = (ms: number, signal?: AbortSignal) => new Promise<void>((resolve, reject) => {
  const t = setTimeout(resolve, ms);
  signal?.addEventListener('abort', () => { clearTimeout(t); reject(signal.reason ?? new Error('Aborted')); }, { once: true });
});

export class AmplitudeClient {
  constructor(private readonly config: Config, private readonly fetchFn: typeof fetch = fetch) {}

  private dashboardBase() { return this.config.region === 'eu' ? 'https://analytics.eu.amplitude.com' : 'https://amplitude.com'; }
  private ingestBase() { return this.config.region === 'eu' ? 'https://api.eu.amplitude.com' : 'https://api2.amplitude.com'; }
  private profileBase() { if (this.config.region === 'eu') throw new Error('Amplitude User Profile API is not available for EU data residency'); return 'https://profile-api.amplitude.com'; }
  private basicAuth() { return `Basic ${Buffer.from(`${this.config.apiKey}:${this.config.secretKey}`).toString('base64')}`; }

  async dashboard(path: string, query: Record<string, QueryValue | QueryValue[]> = {}, signal?: AbortSignal) {
    const url = new URL(path, this.dashboardBase());
    for (const [key, raw] of Object.entries(query)) {
      const values = Array.isArray(raw) ? raw : [raw];
      for (const value of values) if (value !== undefined) url.searchParams.append(key, String(value));
    }
    return this.request(url, { method: 'GET', headers: { Authorization: this.basicAuth(), Accept: 'application/json' } }, true, signal);
  }

  async profile(query: Record<string, QueryValue>, signal?: AbortSignal) {
    const url = new URL('/v1/userprofile', this.profileBase());
    for (const [k, v] of Object.entries(query)) if (v !== undefined) url.searchParams.set(k, String(v));
    return this.request(url, { method: 'GET', headers: { Authorization: `Api-Key ${this.config.secretKey}`, Accept: 'application/json' } }, true, signal);
  }

  async ingest(events: unknown[], options: Record<string, unknown> | undefined, signal?: AbortSignal) {
    const url = new URL('/2/httpapi', this.ingestBase());
    return this.request(url, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ api_key: this.config.apiKey, events, ...(options ? { options } : {}) })
    }, false, signal);
  }

  private async request(url: URL, init: RequestInit, idempotent: boolean, outerSignal?: AbortSignal): Promise<unknown> {
    let last: unknown;
    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      const controller = new AbortController();
      const onAbort = () => controller.abort(outerSignal?.reason);
      outerSignal?.addEventListener('abort', onAbort, { once: true });
      const timer = setTimeout(() => controller.abort(new Error('Amplitude request timed out')), this.config.timeoutMs);
      try {
        const response = await this.fetchFn(url, { ...init, signal: controller.signal });
        const text = await response.text();
        let body: unknown = text;
        try { body = text ? JSON.parse(text) : null; } catch { /* keep text */ }
        if (response.ok) return body;
        const retryAfterRaw = response.headers.get('retry-after');
        const retryAfter = retryAfterRaw ? Number(retryAfterRaw) : undefined;
        const error = new AmplitudeError(response.status, `Amplitude API error ${response.status}`, Number.isFinite(retryAfter) ? retryAfter : undefined, body);
        if (!idempotent || ![429, 500, 502, 503, 504].includes(response.status) || attempt === this.config.maxRetries) throw error;
        const backoff = error.retryAfter !== undefined ? error.retryAfter * 1000 : Math.min(250 * 2 ** attempt, 4000);
        await sleep(backoff, outerSignal);
        last = error;
      } catch (error) {
        if (error instanceof AmplitudeError) throw error;
        if (!idempotent || attempt === this.config.maxRetries || outerSignal?.aborted) throw error;
        last = error;
        await sleep(Math.min(250 * 2 ** attempt, 4000), outerSignal);
      } finally {
        clearTimeout(timer);
        outerSignal?.removeEventListener('abort', onAbort);
      }
    }
    throw last ?? new Error('Amplitude request failed');
  }
}
