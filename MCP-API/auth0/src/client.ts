import { Config } from './config.js';

export class Auth0Error extends Error {
  constructor(public status: number, message: string, public body?: unknown, public retryAfter?: string | null) { super(message); }
}

export class Auth0Client {
  private token?: string;
  private tokenExpiresAt = 0;
  constructor(private cfg: Config, private fetcher: typeof fetch = fetch) {}

  private async accessToken(): Promise<string> {
    if (this.cfg.managementToken) return this.cfg.managementToken;
    if (this.token && Date.now() < this.tokenExpiresAt - 60000) return this.token;
    const res = await this.fetcher(`https://${this.cfg.domain}/oauth/token`, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ grant_type: 'client_credentials', client_id: this.cfg.clientId, client_secret: this.cfg.clientSecret, audience: `https://${this.cfg.domain}/api/v2/` })
    });
    const json = await res.json() as any;
    if (!res.ok || !json.access_token) throw new Auth0Error(res.status, 'Failed to obtain Auth0 Management API token', json);
    this.token = json.access_token;
    this.tokenExpiresAt = Date.now() + Number(json.expires_in ?? 3600) * 1000;
    return this.token;
  }

  async request(method: string, path: string, body?: unknown, signal?: AbortSignal): Promise<any> {
    if (!path.startsWith('/api/v2/')) throw new Error('Only Auth0 Management API v2 paths are allowed');
    let last: unknown;
    for (let attempt = 0; attempt <= this.cfg.maxRetries; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.cfg.timeoutMs);
      const abort = () => controller.abort();
      signal?.addEventListener('abort', abort, { once: true });
      try {
        const token = await this.accessToken();
        const res = await this.fetcher(`https://${this.cfg.domain}${path}`, {
          method,
          signal: controller.signal,
          headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json', accept: 'application/json' },
          body: body === undefined ? undefined : JSON.stringify(body)
        });
        const text = await res.text();
        const parsed = text ? (() => { try { return JSON.parse(text); } catch { return text; } })() : null;
        if (res.ok) return parsed;
        const err = new Auth0Error(res.status, `Auth0 API ${res.status}`, parsed, res.headers.get('retry-after'));
        if (res.status === 401 && !this.cfg.managementToken && attempt === 0) { this.token = undefined; this.tokenExpiresAt = 0; last = err; continue; }
        if ((res.status === 429 || res.status >= 500) && attempt < this.cfg.maxRetries && method === 'GET') {
          const retryAfter = Number(res.headers.get('retry-after'));
          const delay = Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : Math.min(1000, 100 * 2 ** attempt) + Math.floor(Math.random() * 100);
          await new Promise(r => setTimeout(r, delay)); last = err; continue;
        }
        throw err;
      } catch (e) {
        last = e;
        if (e instanceof Auth0Error || attempt >= this.cfg.maxRetries || method !== 'GET') throw e;
        if ((e as any)?.name === 'AbortError' && signal?.aborted) throw e;
        await new Promise(r => setTimeout(r, Math.min(1000, 100 * 2 ** attempt)));
      } finally { clearTimeout(timer); signal?.removeEventListener('abort', abort); }
    }
    throw last;
  }
}
