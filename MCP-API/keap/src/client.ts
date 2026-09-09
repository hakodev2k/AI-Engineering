import type { KeapConfig } from './config.js';

type FetchLike = typeof fetch;
type Json = Record<string, unknown> | unknown[] | string | number | boolean | null;

export class KeapApiError extends Error {
  constructor(public status: number, message: string, public retryAfter?: number) { super(message); }
}

export class KeapClient {
  private accessToken: string;
  private refreshToken?: string;
  constructor(private readonly config: KeapConfig, private readonly fetchImpl: FetchLike = fetch) {
    this.accessToken = config.accessToken;
    this.refreshToken = config.refreshToken;
  }

  async request(method: string, path: string, body?: unknown, query?: Record<string, unknown>): Promise<Json> {
    if (!path.startsWith('/')) throw new Error('Keap path must be relative');
    const verb = method.toUpperCase();
    const retrySafe = verb === 'GET' || verb === 'HEAD';
    const maxAttempts = retrySafe ? this.config.maxRetries + 1 : 1;
    const url = new URL(this.config.apiBase + path);
    for (const [k, v] of Object.entries(query ?? {})) {
      if (v == null) continue;
      if (Array.isArray(v)) for (const item of v) url.searchParams.append(k, String(item));
      else url.searchParams.set(k, String(v));
    }

    let refreshed = false;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const res = await this.fetchImpl(url, {
          method: verb,
          signal: controller.signal,
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Accept': 'application/json',
            ...(body === undefined ? {} : { 'Content-Type': 'application/json' })
          },
          body: body === undefined ? undefined : JSON.stringify(body)
        });

        if (res.status === 401 && !refreshed && this.canRefresh()) {
          await this.refreshAccessToken();
          refreshed = true;
          if (retrySafe) continue;
          throw new KeapApiError(401, 'Keap access token expired during a write request. Token was refreshed, but the write was not replayed automatically; retry only after verifying provider state.');
        }

        if (retrySafe && (res.status === 429 || (res.status >= 500 && res.status <= 599))) {
          const retryAfter = parseRetryAfter(res.headers.get('retry-after'));
          if (attempt + 1 < maxAttempts) {
            await sleep(retryAfter ?? Math.min(1000 * 2 ** attempt, 8000));
            continue;
          }
        }

        const text = await res.text();
        const data = text ? safeJson(text) : null;
        if (!res.ok) {
          const retryAfter = parseRetryAfter(res.headers.get('retry-after'));
          throw new KeapApiError(res.status, `Keap API ${res.status}: ${typeof data === 'string' ? data : JSON.stringify(data)}`, retryAfter);
        }
        return data;
      } catch (error) {
        if (error instanceof KeapApiError) throw error;
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error(`Keap request timed out after ${this.config.timeoutMs}ms; writes are never replayed automatically.`);
        }
        if (!retrySafe || attempt + 1 >= maxAttempts) throw error;
        await sleep(Math.min(1000 * 2 ** attempt, 8000));
      } finally {
        clearTimeout(timer);
      }
    }
    throw new Error('Keap request failed');
  }

  private canRefresh(): boolean {
    return Boolean(this.config.clientId && this.config.clientSecret && this.refreshToken);
  }

  private async refreshAccessToken(): Promise<void> {
    if (!this.config.clientId || !this.config.clientSecret || !this.refreshToken) throw new Error('OAuth refresh configuration incomplete');
    const body = new URLSearchParams({ grant_type: 'refresh_token', refresh_token: this.refreshToken });
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
    try {
      const basic = Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString('base64');
      const res = await this.fetchImpl(this.config.tokenUrl, {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Authorization': `Basic ${basic}`, 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' },
        body
      });
      const data = safeJson(await res.text()) as Record<string, unknown>;
      if (!res.ok || typeof data.access_token !== 'string') throw new Error('Keap OAuth refresh failed; user action may be required');
      this.accessToken = data.access_token;
      if (typeof data.refresh_token === 'string') this.refreshToken = data.refresh_token;
    } finally {
      clearTimeout(timer);
    }
  }
}

function safeJson(text: string): Json { try { return JSON.parse(text) as Json; } catch { return text; } }
function sleep(ms: number): Promise<void> { return new Promise(resolve => setTimeout(resolve, ms)); }
function parseRetryAfter(value: string | null): number | undefined {
  if (!value) return undefined;
  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds >= 0) return Math.min(seconds * 1000, 60000);
  const at = Date.parse(value);
  return Number.isNaN(at) ? undefined : Math.max(0, Math.min(at - Date.now(), 60000));
}
