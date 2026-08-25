import { AirtableConfig } from './config.js';

export class AirtableError extends Error {
  constructor(public readonly status: number, message: string, public readonly retryAfter?: number) { super(message); }
}

export class AirtableRestClient {
  constructor(private readonly config: AirtableConfig, private readonly fetchImpl: typeof fetch = fetch) {}

  private async request<T>(method: string, path: string, body?: unknown, query?: Record<string, string | number | boolean | undefined>): Promise<T> {
    const url = new URL(`${this.config.apiBase}${path}`);
    for (const [k, v] of Object.entries(query ?? {})) if (v !== undefined) url.searchParams.set(k, String(v));
    for (let attempt = 0; ; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const res = await this.fetchImpl(url, {
          method,
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${this.config.token}`,
            Accept: 'application/json',
            ...(body === undefined ? {} : { 'Content-Type': 'application/json' })
          },
          body: body === undefined ? undefined : JSON.stringify(body)
        });
        const retryAfter = Number(res.headers.get('retry-after') ?? 0);
        const retryable = res.status === 429 || res.status >= 500;
        if (retryable && attempt < this.config.maxRetries) {
          await new Promise(r => setTimeout(r, retryAfter > 0 ? retryAfter * 1000 : Math.min(8000, 250 * 2 ** attempt)));
          continue;
        }
        if (!res.ok) {
          const text = await res.text();
          throw new AirtableError(res.status, `Airtable API ${res.status}: ${text.slice(0, 2000)}`, retryAfter || undefined);
        }
        if (res.status === 204) return undefined as T;
        return await res.json() as T;
      } catch (err) {
        if (err instanceof AirtableError) throw err;
        if (err instanceof DOMException && err.name === 'AbortError') throw new Error(`Airtable API timeout after ${this.config.timeoutMs}ms`);
        if (attempt >= this.config.maxRetries) throw err;
        await new Promise(r => setTimeout(r, Math.min(8000, 250 * 2 ** attempt)));
      } finally { clearTimeout(timer); }
    }
  }

  get<T>(path: string, query?: Record<string, string | number | boolean | undefined>) { return this.request<T>('GET', path, undefined, query); }
  post<T>(path: string, body?: unknown) { return this.request<T>('POST', path, body); }
  patch<T>(path: string, body?: unknown) { return this.request<T>('PATCH', path, body); }
  delete<T>(path: string) { return this.request<T>('DELETE', path); }
}
