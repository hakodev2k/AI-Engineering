import type { Config } from './config.js';

export class HoneybadgerApi {
  constructor(private readonly cfg: Config) {}

  async request<T>(method: string, path: string, body?: unknown, query?: Record<string, string | number | boolean | undefined>): Promise<T> {
    const url = new URL(path, this.cfg.apiUrl);
    if (url.origin !== this.cfg.apiUrl) throw new Error('Refusing cross-origin Honeybadger request');
    for (const [k,v] of Object.entries(query ?? {})) if (v !== undefined) url.searchParams.set(k, String(v));
    const headers: Record<string,string> = {
      Accept: 'application/json',
      Authorization: `Basic ${Buffer.from(`${this.cfg.token}:`).toString('base64')}`
    };
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    let last: unknown;
    for (let attempt = 0; attempt < 3; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.cfg.timeoutMs);
      try {
        const res = await fetch(url, { method, headers, body: body === undefined ? undefined : JSON.stringify(body), signal: controller.signal });
        const text = await res.text();
        const parsed = text ? safeJson(text) : null;
        if (res.ok) return parsed as T;
        const remaining = res.headers.get('x-ratelimit-remaining');
        const reset = Number(res.headers.get('x-ratelimit-reset') ?? 0);
        const isRateLimit = res.status === 403 && remaining === '0';
        if (isRateLimit && method === 'GET' && attempt < 2) {
          const wait = reset > 0 ? Math.max(250, Math.min(5000, reset * 1000 - Date.now())) : 500 * 2 ** attempt;
          await sleep(wait + Math.floor(Math.random() * 200));
          continue;
        }
        if (res.status >= 500 && method === 'GET' && attempt < 2) {
          await sleep(300 * 2 ** attempt + Math.floor(Math.random() * 150));
          continue;
        }
        throw new Error(`Honeybadger API ${res.status}: ${typeof parsed === 'string' ? parsed : JSON.stringify(parsed)}`);
      } catch (e) {
        last = e;
        if (e instanceof DOMException && e.name === 'AbortError') throw new Error(`Honeybadger API timeout after ${this.cfg.timeoutMs}ms`);
        if (method !== 'GET' || attempt === 2) throw e;
        await sleep(300 * 2 ** attempt);
      } finally { clearTimeout(timer); }
    }
    throw last instanceof Error ? last : new Error('Honeybadger API request failed');
  }
}

function safeJson(text: string): unknown { try { return JSON.parse(text); } catch { return text; } }
function sleep(ms: number) { return new Promise(resolve => setTimeout(resolve, ms)); }
