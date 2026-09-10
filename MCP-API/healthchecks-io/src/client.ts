import type { Config } from './config.js';

export class HealthchecksError extends Error {
  constructor(public status: number, message: string, public retryAfter?: string) { super(message); }
}

export class HealthchecksClient {
  constructor(private readonly config: Config, private readonly fetchImpl: typeof fetch = fetch) {}

  private async request<T>(method: string, path: string, body?: unknown, query?: Record<string, string | number | boolean | undefined>): Promise<T> {
    const base = this.config.HEALTHCHECKS_API_BASE.replace(/\/$/, '');
    const url = new URL(`${base}/${path.replace(/^\//, '')}`);
    for (const [k, v] of Object.entries(query ?? {})) if (v !== undefined) url.searchParams.set(k, String(v));

    for (let attempt = 0; ; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.HEALTHCHECKS_TIMEOUT_MS);
      try {
        const res = await this.fetchImpl(url, {
          method,
          headers: {
            'X-Api-Key': this.config.HEALTHCHECKS_API_KEY,
            'Accept': 'application/json',
            ...(body === undefined ? {} : { 'Content-Type': 'application/json' })
          },
          body: body === undefined ? undefined : JSON.stringify(body),
          signal: controller.signal
        });
        const text = await res.text();
        if (res.ok) return (text ? JSON.parse(text) : {}) as T;
        const retryable = res.status === 429 || res.status >= 500;
        if (!retryable || attempt >= this.config.HEALTHCHECKS_MAX_RETRIES || method === 'DELETE') {
          throw new HealthchecksError(res.status, text || res.statusText, res.headers.get('Retry-After') ?? undefined);
        }
        const retryAfter = Number(res.headers.get('Retry-After'));
        const delay = Number.isFinite(retryAfter) ? retryAfter * 1000 : Math.min(4000, 250 * 2 ** attempt);
        await new Promise(r => setTimeout(r, delay));
      } finally {
        clearTimeout(timer);
      }
    }
  }

  listChecks(params: { tag?: string; status?: string } = {}) { return this.request('GET', 'checks/', undefined, params); }
  getCheck(id: string) { return this.request('GET', `checks/${encodeURIComponent(id)}`); }
  createCheck(body: unknown) { return this.request('POST', 'checks/', body); }
  updateCheck(id: string, body: unknown) { return this.request('POST', `checks/${encodeURIComponent(id)}`, body); }
  pauseCheck(id: string) { return this.request('POST', `checks/${encodeURIComponent(id)}/pause`); }
  resumeCheck(id: string) { return this.request('POST', `checks/${encodeURIComponent(id)}/resume`); }
  deleteCheck(id: string) { return this.request('DELETE', `checks/${encodeURIComponent(id)}`); }
  listFlips(id: string) { return this.request('GET', `checks/${encodeURIComponent(id)}/flips/`); }
  listChannels() { return this.request('GET', 'channels/'); }
  listBadges() { return this.request('GET', 'badges/'); }
  serviceStatus() { return this.request('GET', 'status/'); }
}
