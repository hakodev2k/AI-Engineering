import type { Config } from './config.js';

export class AxiomApiError extends Error {
  constructor(public readonly status: number, message: string, public readonly retryAfterMs?: number, public readonly code?: string) { super(message); }
}
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class AxiomRestClient {
  constructor(private readonly config: Config, private readonly fetchImpl: typeof fetch = fetch) {}

  async request<T>(method: string, path: string, options: { query?: Record<string, string | number | boolean | undefined>; body?: unknown; retry?: boolean } = {}): Promise<T> {
    const url = new URL(this.config.apiUrl + path);
    for (const [key, value] of Object.entries(options.query ?? {})) if (value !== undefined) url.searchParams.set(key, String(value));
    const retryable = options.retry ?? method === 'GET';
    for (let attempt = 0;; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const headers: Record<string, string> = { Authorization: `Bearer ${this.config.token}`, Accept: 'application/json' };
        if (this.config.orgId) headers['x-axiom-org-id'] = this.config.orgId;
        if (options.body !== undefined) headers['Content-Type'] = 'application/json';
        const response = await this.fetchImpl(url, {
          method,
          headers,
          signal: controller.signal,
          body: options.body === undefined ? undefined : JSON.stringify(options.body)
        });
        const raw = await response.text();
        let data: any = undefined;
        if (raw) { try { data = JSON.parse(raw); } catch { data = { message: raw }; } }
        if (response.ok) return data as T;
        const retryAfter = response.headers.get('retry-after');
        const retryAfterMs = retryAfter ? Math.max(0, Number(retryAfter) * 1000) : undefined;
        if (retryable && (response.status === 429 || response.status >= 500) && attempt < this.config.maxRetries) {
          await sleep(Math.min(retryAfterMs ?? 250 * 2 ** attempt, 10000));
          continue;
        }
        throw new AxiomApiError(response.status, data?.message ?? `Axiom API request failed with ${response.status}`, retryAfterMs, data?.code);
      } catch (error) {
        if (error instanceof AxiomApiError) throw error;
        if (retryable && attempt < this.config.maxRetries) { await sleep(250 * 2 ** attempt); continue; }
        if ((error as Error).name === 'AbortError') throw new Error('Axiom API request timed out');
        throw error;
      } finally { clearTimeout(timer); }
    }
  }

  listDatasets() { return this.request<any[]>('GET', '/v2/datasets'); }
  getDataset(id: string) { return this.request<any>('GET', `/v2/datasets/${encodeURIComponent(id)}`); }
  getDatasetFields(id: string) { return this.request<any[]>('GET', `/v2/datasets/${encodeURIComponent(id)}/fields`); }
  queryApl(apl: string, startTime?: string, endTime?: string) {
    return this.request<any>('POST', '/v1/query/_apl', { query: { format: 'tabular' }, body: { apl, startTime, endTime }, retry: true });
  }
  listMonitors() { return this.request<any[]>('GET', '/v2/monitors'); }
  getMonitor(id: string) { return this.request<any>('GET', `/v2/monitors/${encodeURIComponent(id)}`); }
  getMonitorHistory(id: string, startTime: string, endTime: string) { return this.request<any>('GET', `/v2/monitors/${encodeURIComponent(id)}/history`, { query: { startTime, endTime } }); }
  createMonitor(body: unknown) { return this.request<any>('POST', '/v2/monitors', { body, retry: false }); }
  updateMonitor(id: string, body: unknown) { return this.request<any>('PUT', `/v2/monitors/${encodeURIComponent(id)}`, { body, retry: false }); }
  deleteMonitor(id: string) { return this.request<any>('DELETE', `/v2/monitors/${encodeURIComponent(id)}`, { retry: false }); }
}
