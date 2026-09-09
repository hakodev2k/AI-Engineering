import { EasyPostCredentialProvider } from './auth.js';
import type { EasyPostConfig } from './config.js';

export class EasyPostError extends Error {
  constructor(public readonly status: number, message: string, public readonly retryAfterSeconds?: number) {
    super(message);
    this.name = 'EasyPostError';
  }
}

type Query = Record<string, string | number | boolean | undefined>;

export class EasyPostClient {
  private readonly credentials: EasyPostCredentialProvider;
  constructor(private readonly cfg: EasyPostConfig, private readonly fetchImpl: typeof fetch = fetch) {
    this.credentials = new EasyPostCredentialProvider(cfg.apiKey);
  }

  async request<T>(method: 'GET'|'POST'|'DELETE', path: string, body?: unknown, query?: Query): Promise<T> {
    if (!path.startsWith('/')) throw new Error('EasyPost path must be relative');
    const url = new URL(this.cfg.apiBase.toString().replace(/\/$/, '') + path);
    if (url.protocol !== 'https:' || !this.cfg.allowedApiHosts.has(url.hostname)) throw new Error('Blocked EasyPost API destination');
    for (const [key, value] of Object.entries(query ?? {})) if (value !== undefined) url.searchParams.set(key, String(value));

    const maxAttempts = method === 'GET' ? this.cfg.maxReadRetries + 1 : 1;
    let lastError: unknown;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.cfg.timeoutMs);
      try {
        const response = await this.fetchImpl(url, {
          method,
          signal: controller.signal,
          headers: {
            Authorization: this.credentials.authorizationHeader(),
            Accept: 'application/json',
            ...(body === undefined ? {} : { 'Content-Type': 'application/json' })
          },
          body: body === undefined ? undefined : JSON.stringify(body)
        });
        const text = await response.text();
        const parsed = text ? safeJson(text) : {};
        if (response.ok) return parsed as T;

        const retryAfter = parseRetryAfter(response.headers.get('retry-after'));
        const message = providerMessage(parsed) ?? `EasyPost API request failed with HTTP ${response.status}`;
        const error = new EasyPostError(response.status, message, retryAfter);
        if (attempt < maxAttempts && (response.status === 429 || response.status >= 500)) {
          await sleep(backoffMs(attempt, retryAfter));
          continue;
        }
        throw error;
      } catch (error) {
        lastError = error;
        if (error instanceof EasyPostError) throw error;
        if (attempt >= maxAttempts) {
          if (error instanceof Error && error.name === 'AbortError') throw new Error(`EasyPost request timed out after ${this.cfg.timeoutMs}ms`);
          throw new Error(`EasyPost network request failed: ${error instanceof Error ? error.message : 'unknown error'}`);
        }
        await sleep(backoffMs(attempt));
      } finally {
        clearTimeout(timer);
      }
    }
    throw lastError instanceof Error ? lastError : new Error('EasyPost request failed');
  }
}

function safeJson(text: string): unknown { try { return JSON.parse(text); } catch { return { message: text.slice(0, 1000) }; } }
function providerMessage(value: unknown): string | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const v = value as Record<string, unknown>;
  if (typeof v.error === 'string') return v.error;
  if (v.error && typeof v.error === 'object') {
    const e = v.error as Record<string, unknown>;
    if (typeof e.message === 'string') return e.message;
    if (typeof e.code === 'string') return `EasyPost error ${e.code}`;
  }
  if (typeof v.message === 'string') return v.message;
  return undefined;
}
function parseRetryAfter(value: string | null): number | undefined {
  if (!value) return undefined;
  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds >= 0) return seconds;
  const dateMs = Date.parse(value);
  return Number.isFinite(dateMs) ? Math.max(0, Math.ceil((dateMs - Date.now()) / 1000)) : undefined;
}
function backoffMs(attempt: number, retryAfterSeconds?: number): number {
  if (retryAfterSeconds !== undefined) return Math.min(retryAfterSeconds * 1000, 30000);
  return Math.min(250 * 2 ** (attempt - 1), 4000);
}
function sleep(ms: number): Promise<void> { return new Promise(resolve => setTimeout(resolve, ms)); }
