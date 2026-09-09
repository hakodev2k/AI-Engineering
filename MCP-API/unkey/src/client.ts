import type { Config } from './config.js';

export class UnkeyError extends Error {
  constructor(public status: number, message: string, public retryAfterMs?: number, public requestId?: string) {
    super(message);
  }
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class UnkeyClient {
  constructor(private readonly cfg: Config, private readonly fetchImpl: typeof fetch = fetch) {}

  async call<T>(procedure: string, body: Record<string, unknown>, retryable = true): Promise<T> {
    if (!/^[a-z]+\.[A-Za-z]+$/.test(procedure)) throw new Error('Invalid Unkey procedure');
    const url = new URL(`/v2/${procedure}`, this.cfg.apiBase);
    if (url.protocol !== 'https:' || !this.cfg.allowedHosts.has(url.hostname)) throw new Error('Blocked API destination');

    let last: unknown;
    for (let attempt = 0; attempt < (retryable ? 3 : 1); attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.cfg.timeoutMs);
      try {
        const res = await this.fetchImpl(url, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.cfg.rootKey}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(body),
          signal: controller.signal,
        });
        const text = await res.text();
        let json: any = {};
        try { json = text ? JSON.parse(text) : {}; } catch { json = { raw: text }; }
        if (res.ok) return json as T;

        const requestId = json?.meta?.requestId;
        const detail = json?.error?.detail ?? json?.error?.title ?? `Unkey HTTP ${res.status}`;
        const retryAfterHeader = res.headers.get('retry-after');
        const retryAfterMs = retryAfterHeader ? Math.max(0, Number(retryAfterHeader) * 1000) : undefined;
        const error = new UnkeyError(res.status, detail, retryAfterMs, requestId);

        if (![429, 500, 502, 503, 504].includes(res.status) || attempt === (retryable ? 2 : 0)) throw error;
        await sleep(retryAfterMs ?? 250 * 2 ** attempt);
        last = error;
      } catch (error) {
        if (error instanceof UnkeyError) throw error;
        last = error;
        if (attempt === (retryable ? 2 : 0)) {
          if (error instanceof Error && error.name === 'AbortError') throw new Error('Unkey request timed out');
          throw error;
        }
        await sleep(250 * 2 ** attempt);
      } finally {
        clearTimeout(timer);
      }
    }
    throw last instanceof Error ? last : new Error('Unkey request failed');
  }
}
