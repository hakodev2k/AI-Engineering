import type { Config } from './config.js';

export class FlyApiError extends Error {
  constructor(public status: number, message: string, public retryAfter?: number) { super(message); }
}

export class FlyClient {
  constructor(private config: Config, private fetchImpl: typeof fetch = fetch) {}

  private async request<T>(method: string, path: string, body?: unknown, retryable = true): Promise<T> {
    let attempt = 0;
    while (true) {
      attempt++;
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const res = await this.fetchImpl(`${this.config.baseUrl}${path}`, {
          method,
          headers: {
            Authorization: `Bearer ${this.config.token}`,
            Accept: 'application/json',
            ...(body === undefined ? {} : {'Content-Type': 'application/json'})
          },
          body: body === undefined ? undefined : JSON.stringify(body),
          signal: controller.signal
        });
        const text = await res.text();
        if (res.ok) return (text ? JSON.parse(text) : null) as T;
        const retryAfter = Number(res.headers.get('retry-after') || '0') || undefined;
        const msg = text.slice(0, 2000) || `${res.status} ${res.statusText}`;
        const transient = res.status === 429 || res.status >= 500;
        if (retryable && transient && attempt < 4) {
          const delay = retryAfter ? retryAfter * 1000 : Math.min(500 * 2 ** (attempt - 1), 4000);
          await new Promise(r => setTimeout(r, delay));
          continue;
        }
        throw new FlyApiError(res.status, msg, retryAfter);
      } catch (err) {
        if (err instanceof FlyApiError) throw err;
        if (attempt < 4 && retryable && !(err instanceof DOMException && err.name === 'AbortError')) {
          await new Promise(r => setTimeout(r, Math.min(500 * 2 ** (attempt - 1), 4000)));
          continue;
        }
        if (err instanceof DOMException && err.name === 'AbortError') throw new Error(`Fly.io request timed out after ${this.config.timeoutMs}ms`);
        throw err;
      } finally { clearTimeout(timer); }
    }
  }

  listApps(org: string) { return this.request<any>('GET', `/apps?org_slug=${encodeURIComponent(org)}`); }
  getApp(app: string) { return this.request<any>('GET', `/apps/${encodeURIComponent(app)}`); }
  createApp(input: {app_name:string; org_slug:string; network?:string}) { return this.request<any>('POST', '/apps', input, false); }
  deleteApp(app: string, force = false) { return this.request<any>('DELETE', `/apps/${encodeURIComponent(app)}?force=${force}`, undefined, false); }
  listMachines(app: string) { return this.request<any>('GET', `/apps/${encodeURIComponent(app)}/machines`); }
  getMachine(app: string, machine: string) { return this.request<any>('GET', `/apps/${encodeURIComponent(app)}/machines/${encodeURIComponent(machine)}`); }
  startMachine(app: string, machine: string) { return this.request<any>('POST', `/apps/${encodeURIComponent(app)}/machines/${encodeURIComponent(machine)}/start`, {}, false); }
  stopMachine(app: string, machine: string, signal = 'SIGINT', timeout = '5s') { return this.request<any>('POST', `/apps/${encodeURIComponent(app)}/machines/${encodeURIComponent(machine)}/stop`, {signal, timeout}, false); }
  deleteMachine(app: string, machine: string, force = false) { return this.request<any>('DELETE', `/apps/${encodeURIComponent(app)}/machines/${encodeURIComponent(machine)}?force=${force}`, undefined, false); }
  listVolumes(app: string) { return this.request<any>('GET', `/apps/${encodeURIComponent(app)}/volumes`); }
  getVolume(app: string, volume: string) { return this.request<any>('GET', `/apps/${encodeURIComponent(app)}/volumes/${encodeURIComponent(volume)}`); }
  createVolume(app: string, input: {name:string; region:string; size_gb?:number; snapshot_id?:string}) { return this.request<any>('POST', `/apps/${encodeURIComponent(app)}/volumes`, input, false); }
  deleteVolume(app: string, volume: string) { return this.request<any>('DELETE', `/apps/${encodeURIComponent(app)}/volumes/${encodeURIComponent(volume)}`, undefined, false); }
}
