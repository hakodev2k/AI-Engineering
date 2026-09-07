import type { Config } from './config.js';

export class CannyError extends Error {
  constructor(public status: number, message: string, public retryAfterMs?: number) { super(message); }
}

export class CannyClient {
  constructor(private readonly config: Config, private readonly fetchImpl: typeof fetch = fetch) {}

  async call<T>(path: string, payload: Record<string, unknown>, signal?: AbortSignal): Promise<T> {
    const url = `${this.config.baseUrl}/${path.replace(/^\//, '')}`;
    for (let attempt = 0; ; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      const onAbort = () => controller.abort();
      signal?.addEventListener('abort', onAbort, { once: true });
      try {
        const res = await this.fetchImpl(url, {
          method: 'POST',
          headers: { 'content-type': 'application/json', 'accept': 'application/json' },
          body: JSON.stringify({ ...payload, apiKey: this.config.apiKey }),
          signal: controller.signal
        });
        const text = await res.text();
        const retryAfter = parseRetryAfter(res.headers.get('retry-after'));
        if (!res.ok) {
          const err = new CannyError(res.status, safeMessage(text, res.status), retryAfter);
          if (attempt < this.config.maxRetries && isRetryableStatus(res.status)) {
            await sleep(retryAfter ?? backoff(attempt), signal);
            continue;
          }
          throw err;
        }
        if (text === 'success' || text === '"success"') return 'success' as T;
        try { return JSON.parse(text) as T; } catch { return text as T; }
      } catch (error) {
        if (error instanceof CannyError) throw error;
        if (signal?.aborted) throw new Error('Request cancelled');
        if (attempt < this.config.maxRetries) { await sleep(backoff(attempt), signal); continue; }
        if (error instanceof Error && error.name === 'AbortError') throw new Error('Canny request timed out');
        throw error;
      } finally {
        clearTimeout(timer);
        signal?.removeEventListener('abort', onAbort);
      }
    }
  }
}

function isRetryableStatus(status: number): boolean { return status === 429 || status === 408 || status >= 500; }
function backoff(attempt: number): number { return Math.min(4000, 250 * 2 ** attempt) + Math.floor(Math.random() * 100); }
function parseRetryAfter(value: string | null): number | undefined {
  if (!value) return undefined;
  const seconds = Number(value);
  if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000);
  const at = Date.parse(value);
  return Number.isNaN(at) ? undefined : Math.max(0, at - Date.now());
}
function safeMessage(text: string, status: number): string {
  try { const j = JSON.parse(text); return `Canny API ${status}: ${String(j.error || j.message || 'request failed')}`; }
  catch { return `Canny API ${status}: ${text.slice(0, 300) || 'request failed'}`; }
}
function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(resolve, ms);
    signal?.addEventListener('abort', () => { clearTimeout(t); reject(new Error('Request cancelled')); }, { once: true });
  });
}
