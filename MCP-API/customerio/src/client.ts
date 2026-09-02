import type { Config } from './config.js';
export class CustomerIoApiError extends Error {
  constructor(public readonly status: number, message: string, public readonly retryAfterMs?: number) { super(message); }
}
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
export class CustomerIoClient {
  constructor(private readonly config: Config, private readonly fetchImpl: typeof fetch = fetch) {}
  async request<T>(method: string, path: string, options: { query?: Record<string, string|number|boolean|undefined>; body?: unknown; idempotent?: boolean } = {}): Promise<T> {
    const url = new URL(this.config.apiBaseUrl + path);
    for (const [key, value] of Object.entries(options.query ?? {})) if (value !== undefined) url.searchParams.set(key, String(value));
    const retryable = options.idempotent ?? method === 'GET';
    for (let attempt = 0;; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const response = await this.fetchImpl(url, {
          method,
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${this.config.appApiKey}`,
            Accept: 'application/json',
            ...(options.body !== undefined ? { 'Content-Type': 'application/json' } : {})
          },
          body: options.body !== undefined ? JSON.stringify(options.body) : undefined
        });
        const raw = await response.text();
        let data: any = undefined;
        if (raw) { try { data = JSON.parse(raw); } catch { data = { raw }; } }
        if (response.ok) return data as T;
        const retryAfter = response.headers.get('retry-after');
        const retryAfterMs = retryAfter ? Math.max(0, Number(retryAfter) * 1000) : undefined;
        if (retryable && (response.status === 429 || response.status >= 500) && attempt < this.config.maxRetries) {
          await sleep(Math.min(retryAfterMs ?? 250 * 2 ** attempt, 10000));
          continue;
        }
        const message = typeof data?.message === 'string' ? data.message : typeof data?.error === 'string' ? data.error : `Customer.io API ${response.status}`;
        throw new CustomerIoApiError(response.status, message, retryAfterMs);
      } catch (error) {
        if (error instanceof CustomerIoApiError) throw error;
        if (retryable && attempt < this.config.maxRetries) { await sleep(250 * 2 ** attempt); continue; }
        if ((error as Error).name === 'AbortError') throw new Error('Customer.io API request timed out');
        throw error;
      } finally { clearTimeout(timer); }
    }
  }
  async paginate<T>(path: string, query: Record<string,string|number|boolean|undefined> = {}, maxPages = 10, arrayField?: string): Promise<T[]> {
    const output: T[] = [];
    let start: string | undefined;
    for (let page = 0; page < maxPages; page++) {
      const response: any = await this.request('GET', path, { query: { ...query, start } });
      const items = arrayField ? response?.[arrayField] : response?.items ?? response?.data;
      if (!Array.isArray(items)) break;
      output.push(...items);
      start = response?.next || undefined;
      if (!start) break;
    }
    return output;
  }
}
