import type { PrefectConfig } from './config.js';

export class PrefectError extends Error {
  constructor(message: string, public status?: number, public retryAfter?: number) { super(message); }
}

function retryAfterSeconds(headers: Headers): number | undefined {
  const v = headers.get('retry-after');
  if (!v) return undefined;
  const n = Number(v);
  if (Number.isFinite(n) && n >= 0) return n;
  const t = Date.parse(v);
  return Number.isFinite(t) ? Math.max(0, Math.ceil((t - Date.now()) / 1000)) : undefined;
}

export class PrefectClient {
  constructor(private readonly cfg: PrefectConfig, private readonly fetchImpl: typeof fetch = fetch) {}

  async request(method: 'GET' | 'POST', path: string, body?: unknown, retrySafe = method === 'GET'): Promise<unknown> {
    const url = new URL(`${this.cfg.apiUrl}${path}`);
    const attempts = retrySafe ? this.cfg.maxRetries + 1 : 1;
    let last: unknown;
    for (let attempt = 0; attempt < attempts; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.cfg.timeoutMs);
      try {
        const headers: Record<string, string> = {
          'accept': 'application/json',
          'content-type': 'application/json',
          'x-prefect-api-version': this.cfg.apiVersion
        };
        if (this.cfg.apiKey) headers.authorization = `Bearer ${this.cfg.apiKey}`;
        const response = await this.fetchImpl(url, { method, headers, body: body === undefined ? undefined : JSON.stringify(body), signal: controller.signal });
        const text = await response.text();
        const parsed = text ? (() => { try { return JSON.parse(text); } catch { return text; } })() : null;
        if (response.ok) return parsed;
        const ra = retryAfterSeconds(response.headers);
        const err = new PrefectError(`Prefect API ${response.status}: ${typeof parsed === 'string' ? parsed.slice(0, 1000) : JSON.stringify(parsed).slice(0, 1000)}`, response.status, ra);
        if (!retrySafe || ![429, 502, 503, 504].includes(response.status) || attempt + 1 >= attempts) throw err;
        await new Promise(r => setTimeout(r, Math.min(5000, (ra ?? 2 ** attempt) * 1000)));
        last = err;
      } catch (e) {
        last = e;
        if (!retrySafe || attempt + 1 >= attempts || (e instanceof PrefectError && ![429, 502, 503, 504].includes(e.status ?? 0))) throw e;
        await new Promise(r => setTimeout(r, Math.min(5000, 250 * 2 ** attempt)));
      } finally { clearTimeout(timer); }
    }
    throw last instanceof Error ? last : new Error('Prefect request failed');
  }
}

export function cleanProviderData(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(cleanProviderData);
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = /(token|secret|password|credential|api[_-]?key)/i.test(k) ? '[REDACTED]' : cleanProviderData(v);
    }
    return out;
  }
  return value;
}
