import type { SauceConfig } from './config.js';

export class SauceApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly retryAfterSeconds?: number,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'SauceApiError';
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function parseRetryAfter(value: string | null): number | undefined {
  if (!value) return undefined;
  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds >= 0) return seconds;
  const date = Date.parse(value);
  return Number.isFinite(date) ? Math.max(0, Math.ceil((date - Date.now()) / 1000)) : undefined;
}

export class SauceRestClient {
  private readonly auth: string;

  constructor(private readonly config: SauceConfig) {
    this.auth = `Basic ${Buffer.from(`${config.username}:${config.accessKey}`, 'utf8').toString('base64')}`;
  }

  async request<T>(method: 'GET' | 'PUT', path: string, body?: unknown): Promise<T> {
    if (!path.startsWith('/') || path.includes('://')) throw new Error('REST path must be relative to the configured Sauce Labs API origin');
    const isRead = method === 'GET';
    const attempts = isRead ? this.config.maxRetries + 1 : 1;

    for (let attempt = 0; attempt < attempts; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const response = await fetch(`${this.config.apiBaseUrl}${path}`, {
          method,
          signal: controller.signal,
          headers: {
            Authorization: this.auth,
            Accept: 'application/json',
            ...(body === undefined ? {} : { 'Content-Type': 'application/json' })
          },
          ...(body === undefined ? {} : { body: JSON.stringify(body) })
        });

        const retryAfter = parseRetryAfter(response.headers.get('retry-after'));
        const text = await response.text();
        let payload: unknown = undefined;
        if (text) {
          try { payload = JSON.parse(text); } catch { payload = text; }
        }

        if (response.ok) return payload as T;

        const error = new SauceApiError(`Sauce Labs API request failed with HTTP ${response.status}`, response.status, retryAfter, payload);
        const retryable = isRead && (response.status === 429 || response.status >= 500) && attempt + 1 < attempts;
        if (!retryable) throw error;

        const delay = retryAfter !== undefined ? retryAfter * 1000 : Math.min(4000, 250 * 2 ** attempt);
        await sleep(delay);
      } catch (error) {
        if (error instanceof SauceApiError) throw error;
        if (error instanceof Error && error.name === 'AbortError') throw new SauceApiError('Sauce Labs API request timed out', 408);
        if (!isRead || attempt + 1 >= attempts) throw error;
        await sleep(Math.min(4000, 250 * 2 ** attempt));
      } finally {
        clearTimeout(timer);
      }
    }
    throw new Error('unreachable');
  }

  updateVirtualJob(jobId: string, patch: { name?: string; tags?: string[]; passed?: boolean; build?: string; public?: 'private' | 'team' }): Promise<unknown> {
    return this.request('PUT', `/rest/v1/${encodeURIComponent(this.config.username)}/jobs/${encodeURIComponent(jobId)}`, patch);
  }

  stopVirtualJob(jobId: string): Promise<unknown> {
    return this.request('PUT', `/rest/v1/${encodeURIComponent(this.config.username)}/jobs/${encodeURIComponent(jobId)}/stop`);
  }
}
