import { config, assertConfig } from './config.js';

export class UpCloudError extends Error {
  constructor(message: string, public status?: number, public retryAfterMs?: number) { super(message); }
}

export class UpCloudClient {
  async request<T>(path: string, init: RequestInit = {}, retryable = true): Promise<T> {
    assertConfig();
    const url = `${config.baseUrl}${path}`;
    let attempt = 0;
    for (;;) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), config.timeoutMs);
      try {
        const res = await fetch(url, {
          ...init,
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${config.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
            ...(init.headers ?? {}),
          },
        });
        const text = await res.text();
        const data = text ? JSON.parse(text) : {};
        if (res.ok) return data as T;
        const retryAfter = Number(res.headers.get('retry-after') ?? '0');
        if ((res.status === 429 || res.status >= 500) && retryable && attempt < config.maxRetries) {
          const wait = retryAfter > 0 ? retryAfter * 1000 : Math.min(4000, 250 * 2 ** attempt);
          attempt++;
          await new Promise(r => setTimeout(r, wait));
          continue;
        }
        throw new UpCloudError(data?.error?.error_message ?? data?.message ?? `UpCloud API error ${res.status}`, res.status, retryAfter ? retryAfter * 1000 : undefined);
      } catch (e: any) {
        if (e?.name === 'AbortError') throw new UpCloudError('UpCloud request timed out');
        if (e instanceof UpCloudError) throw e;
        if (retryable && attempt < config.maxRetries) {
          attempt++;
          await new Promise(r => setTimeout(r, Math.min(4000, 250 * 2 ** attempt)));
          continue;
        }
        throw new UpCloudError(e?.message ?? 'Network error');
      } finally { clearTimeout(timer); }
    }
  }

  listZones() { return this.request('/zone'); }
  listPlans() { return this.request('/plan'); }
  listServers() { return this.request('/server'); }
  getServer(uuid: string) { return this.request(`/server/${encodeURIComponent(uuid)}`); }
  listStorages() { return this.request('/storage'); }
  getStorage(uuid: string) { return this.request(`/storage/${encodeURIComponent(uuid)}`); }
  listIpAddresses() { return this.request('/ip_address'); }
  createServer(payload: unknown) { return this.request('/server', { method: 'POST', body: JSON.stringify(payload) }, false); }
  startServer(uuid: string) { return this.request(`/server/${encodeURIComponent(uuid)}/start`, { method: 'POST' }, false); }
  stopServer(uuid: string, timeout = 30) { return this.request(`/server/${encodeURIComponent(uuid)}/stop`, { method: 'POST', body: JSON.stringify({ stop_server: { stop_type: 'soft', timeout } }) }, false); }
  restartServer(uuid: string, timeout = 30) { return this.request(`/server/${encodeURIComponent(uuid)}/restart`, { method: 'POST', body: JSON.stringify({ restart_server: { stop_type: 'soft', timeout } }) }, false); }
  deleteServer(uuid: string) { return this.request(`/server/${encodeURIComponent(uuid)}`, { method: 'DELETE' }, false); }
}
