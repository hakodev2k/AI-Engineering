import crypto from 'node:crypto';
import type { OvhConfig } from './config.js';

export class OvhError extends Error {
  constructor(message: string, public status?: number, public retryAfterSeconds?: number) { super(message); }
}

export class OvhClient {
  private timeDelta = 0;
  constructor(private readonly config: OvhConfig, private readonly fetchImpl: typeof fetch = fetch) {}

  private async syncTime(): Promise<void> {
    const r = await this.fetchImpl(`${this.config.endpoint}/auth/time`);
    if (!r.ok) throw new OvhError('Unable to synchronize OVHcloud API time', r.status);
    const server = Number(await r.text());
    if (!Number.isFinite(server)) throw new OvhError('Invalid OVHcloud API time response');
    this.timeDelta = server - Math.floor(Date.now() / 1000);
  }

  private signature(method: string, url: string, body: string, timestamp: number): string {
    const raw = `${this.config.applicationSecret}+${this.config.consumerKey}+${method}+${url}+${body}+${timestamp}`;
    return '$1$' + crypto.createHash('sha1').update(raw).digest('hex');
  }

  async request<T>(method: 'GET'|'POST'|'PUT'|'DELETE', path: string, body?: unknown, retryable = method === 'GET'): Promise<T> {
    if (!path.startsWith('/') || path.includes('://')) throw new Error('Only provider-relative OVHcloud API paths are allowed');
    if (!this.timeDelta) await this.syncTime();
    const url = `${this.config.endpoint}${path}`;
    const payload = body === undefined ? '' : JSON.stringify(body);
    const attempts = retryable ? this.config.maxRetries + 1 : 1;
    for (let attempt = 0; attempt < attempts; attempt++) {
      const timestamp = Math.floor(Date.now()/1000) + this.timeDelta;
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const response = await this.fetchImpl(url, {
          method,
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            'X-Ovh-Application': this.config.applicationKey,
            'X-Ovh-Consumer': this.config.consumerKey,
            'X-Ovh-Timestamp': String(timestamp),
            'X-Ovh-Signature': this.signature(method, url, payload, timestamp),
          },
          body: payload || undefined,
        });
        if (response.ok) {
          if (response.status === 204) return undefined as T;
          const text = await response.text();
          return (text ? JSON.parse(text) : undefined) as T;
        }
        const retryAfter = Number(response.headers.get('retry-after'));
        const detail = (await response.text()).slice(0, 1000);
        if (!retryable || ![429,502,503,504].includes(response.status) || attempt === attempts - 1) {
          throw new OvhError(`OVHcloud API ${response.status}: ${detail || response.statusText}`, response.status, Number.isFinite(retryAfter) ? retryAfter : undefined);
        }
        await new Promise(r => setTimeout(r, Number.isFinite(retryAfter) ? Math.min(retryAfter*1000,10000) : Math.min(250 * 2 ** attempt, 3000)));
      } catch (e) {
        if (e instanceof OvhError) throw e;
        if (attempt === attempts - 1) throw new OvhError(e instanceof Error && e.name === 'AbortError' ? 'OVHcloud request timed out' : 'OVHcloud network error');
        await new Promise(r => setTimeout(r, Math.min(250 * 2 ** attempt, 3000)));
      } finally { clearTimeout(timer); }
    }
    throw new OvhError('OVHcloud request failed');
  }
}
