import { PostmarkAuth } from './auth.js';
import { safeBaseUrl } from './security.js';

export class PostmarkError extends Error {
  constructor(message: string, public readonly status: number, public readonly retryAfter?: number) { super(message); }
}

export interface ClientOptions { baseUrl?: string; timeoutMs?: number; maxRetries?: number; fetchImpl?: typeof fetch; }

export class PostmarkClient {
  private readonly base: URL;
  private readonly timeoutMs: number;
  private readonly maxRetries: number;
  private readonly fetchImpl: typeof fetch;
  constructor(private readonly auth: PostmarkAuth, options: ClientOptions = {}) {
    this.base = safeBaseUrl(options.baseUrl ?? 'https://api.postmarkapp.com');
    this.timeoutMs = options.timeoutMs ?? 10000;
    this.maxRetries = options.maxRetries ?? 2;
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  async request<T>(method: string, path: string, body?: unknown, signal?: AbortSignal): Promise<T> {
    if (!path.startsWith('/') || path.startsWith('//')) throw new Error('Invalid API path');
    const retryable = method === 'GET';
    for (let attempt = 0; ; attempt++) {
      const timeout = AbortSignal.timeout(this.timeoutMs);
      const combined = signal ? AbortSignal.any([signal, timeout]) : timeout;
      try {
        const res = await this.fetchImpl(new URL(path, this.base), { method, headers: this.auth.headers(), body: body === undefined ? undefined : JSON.stringify(body), signal: combined });
        const text = await res.text();
        let data: unknown = null;
        if (text) { try { data = JSON.parse(text); } catch { data = { Message: text }; } }
        if (res.ok) return data as T;
        const retryAfter = this.retryAfter(res);
        const msg = typeof data === 'object' && data && 'Message' in data ? String((data as {Message: unknown}).Message) : `Postmark HTTP ${res.status}`;
        if (retryable && attempt < this.maxRetries && (res.status === 429 || res.status >= 500)) {
          await this.sleep(retryAfter ?? Math.min(250 * 2 ** attempt, 2000), signal);
          continue;
        }
        throw new PostmarkError(msg, res.status, retryAfter);
      } catch (err) {
        if (err instanceof PostmarkError) throw err;
        if (combined.aborted) throw new PostmarkError('Postmark request timed out or was cancelled', 408);
        if (retryable && attempt < this.maxRetries) { await this.sleep(Math.min(250 * 2 ** attempt, 2000), signal); continue; }
        throw new PostmarkError(err instanceof Error ? err.message : 'Network failure', 0);
      }
    }
  }

  private retryAfter(res: Response): number | undefined {
    const raw = res.headers.get('retry-after'); if (!raw) return undefined;
    const seconds = Number(raw); return Number.isFinite(seconds) ? Math.max(0, seconds * 1000) : undefined;
  }
  private sleep(ms: number, signal?: AbortSignal): Promise<void> {
    return new Promise((resolve, reject) => { const id = setTimeout(resolve, ms); signal?.addEventListener('abort', () => { clearTimeout(id); reject(new Error('cancelled')); }, { once: true }); });
  }
}
