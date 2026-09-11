import type { Config } from './config.js';

export class CronitorError extends Error {
  constructor(public status: number, message: string, public retryAfter?: string) { super(message); }
}

export class CronitorClient {
  constructor(private readonly config: Config, private readonly fetchImpl: typeof fetch = fetch) {}

  async request<T>(path: string, init: RequestInit = {}, retryable = true): Promise<T> {
    const url = `${this.config.apiBase}${path.startsWith('/') ? path : `/${path}`}`;
    const headers = new Headers(init.headers);
    headers.set('Authorization', `Basic ${Buffer.from(`${this.config.apiKey}:`).toString('base64')}`);
    headers.set('Accept', 'application/json');
    headers.set('Cronitor-Version', this.config.apiVersion);
    if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');

    const maxAttempts = retryable ? 3 : 1;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const res = await this.fetchImpl(url, { ...init, headers, signal: controller.signal });
        if (res.ok) {
          if (res.status === 204) return undefined as T;
          const text = await res.text();
          return (text ? JSON.parse(text) : undefined) as T;
        }
        const text = await res.text();
        const message = text || `${res.status} ${res.statusText}`;
        const retryAfter = res.headers.get('Retry-After') ?? undefined;
        const mayRetry = retryable && (res.status === 429 || res.status >= 500) && attempt < maxAttempts;
        if (!mayRetry) throw new CronitorError(res.status, message, retryAfter);
        const retryMs = retryAfter && /^\d+$/.test(retryAfter) ? Number(retryAfter) * 1000 : 250 * 2 ** (attempt - 1);
        await new Promise(resolve => setTimeout(resolve, Math.min(retryMs, 5000)));
      } catch (error) {
        if (error instanceof CronitorError) throw error;
        if (attempt >= maxAttempts) {
          if ((error as Error).name === 'AbortError') throw new Error(`Cronitor request timed out after ${this.config.timeoutMs}ms.`);
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, 250 * 2 ** (attempt - 1)));
      } finally {
        clearTimeout(timer);
      }
    }
    throw new Error('Unreachable retry state.');
  }

  async sendTelemetry(monitorKey: string, state: 'run' | 'complete' | 'fail' | 'ok', message?: string): Promise<{ accepted: true }> {
    const key = this.config.telemetryKey;
    if (!key) throw new Error('CRONITOR_TELEMETRY_KEY is required for telemetry.send.');
    const params = new URLSearchParams({ state });
    if (message) params.set('message', message);
    const url = `${this.config.telemetryBase}/p/${encodeURIComponent(key)}/${encodeURIComponent(monitorKey)}?${params}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
    try {
      const res = await this.fetchImpl(url, { method: 'GET', signal: controller.signal });
      if (!res.ok) throw new CronitorError(res.status, `Telemetry HTTP ${res.status}`);
      return { accepted: true };
    } finally {
      clearTimeout(timer);
    }
  }
}
