import type { Config } from './config.js';

export class WorkOSError extends Error {
  constructor(message: string, public readonly status?: number, public readonly retryAfterMs?: number) { super(message); }
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export class WorkOSClient {
  constructor(private readonly config: Config, private readonly fetchImpl: typeof fetch = fetch) {}

  async request<T>(method: 'GET'|'POST', path: string, query?: Record<string, unknown>, body?: unknown, headers?: Record<string,string>): Promise<T> {
    const url = new URL(path, this.config.baseUrl);
    for (const [k,v] of Object.entries(query || {})) {
      if (v === undefined || v === null || v === '') continue;
      if (Array.isArray(v)) v.forEach(x => url.searchParams.append(k, String(x)));
      else url.searchParams.set(k, String(v));
    }
    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const res = await this.fetchImpl(url, {
          method,
          headers: {
            Authorization: `Bearer ${this.config.apiKey}`,
            Accept: 'application/json',
            ...(body ? {'Content-Type':'application/json'} : {}),
            ...headers
          },
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal
        });
        const text = await res.text();
        const data = text ? JSON.parse(text) : {};
        if (res.ok) return data as T;
        const retryAfter = Number(res.headers.get('retry-after') || 0) * 1000;
        if (res.status === 429 && attempt < this.config.maxRetries) {
          await sleep(Math.max(retryAfter || 0, 250 * 2 ** attempt));
          continue;
        }
        if (res.status >= 500 && attempt < this.config.maxRetries && method === 'GET') {
          await sleep(250 * 2 ** attempt);
          continue;
        }
        throw new WorkOSError(data?.message || `WorkOS API error ${res.status}`, res.status, retryAfter || undefined);
      } catch (err) {
        if (err instanceof WorkOSError) throw err;
        if (attempt < this.config.maxRetries && method === 'GET') { await sleep(250 * 2 ** attempt); continue; }
        if ((err as Error).name === 'AbortError') throw new WorkOSError('WorkOS request timed out');
        throw new WorkOSError((err as Error).message);
      } finally { clearTimeout(timer); }
    }
    throw new WorkOSError('WorkOS request failed');
  }

  get<T>(path: string, query?: Record<string, unknown>) { return this.request<T>('GET', path, query); }
  post<T>(path: string, body: unknown, headers?: Record<string,string>) { return this.request<T>('POST', path, undefined, body, headers); }
}
