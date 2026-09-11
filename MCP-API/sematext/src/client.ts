import type { SematextConfig } from './config.js';

export class SematextError extends Error {
  constructor(public status: number, message: string, public retryAfter?: number) { super(message); }
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export class SematextClient {
  constructor(private readonly cfg: SematextConfig, private readonly fetcher: typeof fetch = fetch) {}

  private async request<T>(url: string, init: RequestInit = {}, retryable = true): Promise<T> {
    for (let attempt = 0; ; attempt++) {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), this.cfg.timeoutMs);
      try {
        const res = await this.fetcher(url, {
          ...init,
          signal: ctrl.signal,
          headers: { Authorization: `apiKey ${this.cfg.apiKey}`, Accept: 'application/json', ...(init.body ? { 'Content-Type': 'application/json' } : {}), ...(init.headers ?? {}) }
        });
        const text = await res.text();
        const body = text ? JSON.parse(text) : null;
        if (res.ok) return body as T;
        const retryAfter = Number(res.headers.get('retry-after') ?? '0') || undefined;
        const retry = retryable && attempt < this.cfg.maxRetries && (res.status === 429 || res.status >= 500);
        if (!retry) throw new SematextError(res.status, body?.message ?? `Sematext request failed with HTTP ${res.status}`, retryAfter);
        await sleep(Math.min(10000, retryAfter ? retryAfter * 1000 : 250 * 2 ** attempt));
      } catch (e) {
        if (e instanceof SematextError) throw e;
        if (attempt >= this.cfg.maxRetries || !retryable) throw e;
        await sleep(Math.min(10000, 250 * 2 ** attempt));
      } finally { clearTimeout(timer); }
    }
  }

  listApps() { return this.request<any>(`${this.cfg.appsBaseUrl}/users-web/api/v3/apps`); }
  listMonitors(appId: number) { return this.request<any>(`${this.cfg.syntheticsBaseUrl}/api/apps/${appId}/monitors`); }
  getMonitor(appId: number, monitorId: number) { return this.request<any>(`${this.cfg.syntheticsBaseUrl}/api/apps/${appId}/monitors/${monitorId}`); }
  runMonitors(appId: number, runs: Array<{ monitorId: number; regions: number[] }>) {
    return this.request<any>(`${this.cfg.syntheticsBaseUrl}/api/v3/apps/${appId}/monitors/runs`, { method: 'POST', body: JSON.stringify(runs) }, false);
  }
  createHttpMonitor(appId: number, body: unknown) {
    return this.request<any>(`${this.cfg.syntheticsBaseUrl}/api/apps/${appId}/monitors/http`, { method: 'POST', body: JSON.stringify(body) }, false);
  }
  createBrowserMonitor(appId: number, body: unknown) {
    return this.request<any>(`${this.cfg.syntheticsBaseUrl}/api/apps/${appId}/monitors/browser`, { method: 'POST', body: JSON.stringify(body) }, false);
  }
  searchLogs(appToken: string, query: unknown) {
    return this.request<any>(`${this.cfg.logsSearchBaseUrl}/${encodeURIComponent(appToken)}/_search`, { method: 'POST', body: JSON.stringify(query) });
  }
  searchEvents(appToken: string, query: unknown) {
    return this.request<any>(`${this.cfg.eventsBaseUrl}/${encodeURIComponent(appToken)}/_search`, { method: 'POST', body: JSON.stringify(query) });
  }
  addEvent(appToken: string, event: unknown) {
    return this.request<any>(`${this.cfg.eventsBaseUrl}/${encodeURIComponent(appToken)}/event`, { method: 'POST', body: JSON.stringify(event) }, false);
  }
}
