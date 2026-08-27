import { Config } from './config.js';

export class TailscaleError extends Error {
  constructor(public status: number, message: string, public retryAfter?: number) { super(message); }
}

type TokenCache = { token: string; expiresAt: number };

export class TailscaleClient {
  private tokenCache?: TokenCache;
  constructor(private cfg: Config) {}

  private async authHeader(): Promise<string> {
    if (this.cfg.oauthClientId && this.cfg.oauthClientSecret) {
      const now = Date.now();
      if (this.tokenCache && this.tokenCache.expiresAt - now > 60_000) return `Bearer ${this.tokenCache.token}`;
      const body = new URLSearchParams({ client_id: this.cfg.oauthClientId, client_secret: this.cfg.oauthClientSecret });
      const r = await fetch('https://api.tailscale.com/api/v2/oauth/token', {
        method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body,
        signal: AbortSignal.timeout(this.cfg.timeoutMs)
      });
      if (!r.ok) throw new TailscaleError(r.status, `OAuth token request failed (${r.status})`);
      const json = await r.json() as { access_token: string; expires_in?: number };
      if (!json.access_token) throw new Error('OAuth response missing access_token');
      this.tokenCache = { token: json.access_token, expiresAt: now + (json.expires_in ?? 3600) * 1000 };
      return `Bearer ${json.access_token}`;
    }
    return `Basic ${Buffer.from(`${this.cfg.apiKey ?? ''}:`).toString('base64')}`;
  }

  async request<T>(method: string, path: string, body?: unknown, retry = true): Promise<T> {
    const url = `${this.cfg.apiBaseUrl}${path}`;
    const headers: Record<string,string> = { authorization: await this.authHeader(), accept: 'application/json' };
    if (body !== undefined) headers['content-type'] = 'application/json';
    let res: Response;
    try {
      res = await fetch(url, { method, headers, body: body === undefined ? undefined : JSON.stringify(body), signal: AbortSignal.timeout(this.cfg.timeoutMs) });
    } catch (e) {
      throw new Error(`Tailscale network error: ${e instanceof Error ? e.message : String(e)}`);
    }
    if (res.status === 429 && retry && ['GET','HEAD'].includes(method)) {
      const retryAfter = Math.min(Number(res.headers.get('retry-after') ?? '1') || 1, 10);
      await new Promise(r => setTimeout(r, retryAfter * 1000));
      return this.request<T>(method, path, body, false);
    }
    if (!res.ok) {
      const text = (await res.text()).slice(0, 2000);
      const retryAfter = Number(res.headers.get('retry-after') ?? '') || undefined;
      throw new TailscaleError(res.status, `Tailscale API ${res.status}: ${text}`, retryAfter);
    }
    if (res.status === 204) return undefined as T;
    const text = await res.text();
    return (text ? JSON.parse(text) : undefined) as T;
  }

  tailnetPath(suffix: string) { return `/tailnet/${encodeURIComponent(this.cfg.tailnet)}${suffix}`; }
}
