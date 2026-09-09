import type { Config } from './config.js';

type QueryValue = string | number | boolean | string[] | undefined;

export class ChecklyApiError extends Error {
  constructor(public readonly status: number, message: string, public readonly retryAfterMs?: number) {
    super(message);
  }
}

function retryAfterMs(value: string | null): number | undefined {
  if (!value) return undefined;
  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds >= 0) return seconds * 1000;
  const date = Date.parse(value);
  return Number.isNaN(date) ? undefined : Math.max(0, date - Date.now());
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class ChecklyClient {
  constructor(private readonly cfg: Config, private readonly fetchImpl: typeof fetch = fetch) {}

  async request(method: 'GET' | 'POST', path: string, body?: unknown, query?: Record<string, QueryValue>): Promise<unknown> {
    if (!/^\/v\d+\/[A-Za-z0-9_?&=./-]*$/.test(path) || path.includes('..')) throw new Error('Unsafe Checkly API path');
    const url = new URL(path, `${this.cfg.apiBase}/`);
    if (url.origin !== new URL(this.cfg.apiBase).origin) throw new Error('Cross-origin Checkly request blocked');
    for (const [key, value] of Object.entries(query ?? {})) {
      if (value === undefined) continue;
      if (Array.isArray(value)) value.forEach(v => url.searchParams.append(key, v));
      else url.searchParams.set(key, String(value));
    }

    const attempts = method === 'GET' ? this.cfg.maxReadRetries + 1 : 1;
    let lastError: unknown;
    for (let attempt = 0; attempt < attempts; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.cfg.timeoutMs);
      try {
        const response = await this.fetchImpl(url, {
          method,
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${this.cfg.apiKey}`,
            'X-Checkly-Account': this.cfg.accountId,
            Accept: 'application/json',
            ...(body === undefined ? {} : {'Content-Type': 'application/json'})
          },
          body: body === undefined ? undefined : JSON.stringify(body)
        });
        const text = await response.text();
        const data = text ? (() => { try { return JSON.parse(text); } catch { return {message: text.slice(0, 2000)}; } })() : null;
        if (response.ok) return data;

        const wait = retryAfterMs(response.headers.get('retry-after'));
        const message = typeof data === 'object' && data && 'message' in data ? String((data as {message?: unknown}).message) : `Checkly API error ${response.status}`;
        const error = new ChecklyApiError(response.status, message, wait);
        if (method === 'GET' && attempt + 1 < attempts && (response.status === 429 || response.status >= 500)) {
          await sleep(Math.min(wait ?? 250 * 2 ** attempt, 5000));
          continue;
        }
        throw error;
      } catch (error) {
        lastError = error;
        const retryableNetwork = method === 'GET' && !(error instanceof ChecklyApiError) && attempt + 1 < attempts;
        if (retryableNetwork) {
          await sleep(Math.min(250 * 2 ** attempt, 5000));
          continue;
        }
        throw error instanceof Error && error.name === 'AbortError' ? new Error('Checkly request timed out') : error;
      } finally {
        clearTimeout(timer);
      }
    }
    throw lastError ?? new Error('Checkly request failed');
  }
}
