import { SegmentConfig } from './config.js';

export class SegmentApiError extends Error {
  constructor(public status: number, message: string, public retryAfter?: string, public details?: unknown) {
    super(message);
    this.name = 'SegmentApiError';
  }
}

export class SegmentClient {
  constructor(private readonly config: SegmentConfig, private readonly fetchImpl: typeof fetch = fetch) {}

  async request<T>(method: string, path: string, body?: unknown, signal?: AbortSignal): Promise<T> {
    const idempotent = method === 'GET' || method === 'HEAD';
    let attempt = 0;
    while (true) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), this.config.timeoutMs);
      const onAbort = () => controller.abort();
      signal?.addEventListener('abort', onAbort, { once: true });
      try {
        const response = await this.fetchImpl(new URL(path, this.config.baseUrl), {
          method,
          headers: {
            authorization: `Bearer ${this.config.token}`,
            accept: 'application/vnd.segment.v1+json',
            ...(body === undefined ? {} : { 'content-type': 'application/json' })
          },
          body: body === undefined ? undefined : JSON.stringify(body),
          signal: controller.signal
        });
        const text = await response.text();
        let payload: unknown = undefined;
        if (text) {
          try { payload = JSON.parse(text); } catch { payload = text; }
        }
        if (response.ok) return payload as T;
        const retryAfter = response.headers.get('retry-after') ?? response.headers.get('x-ratelimit-reset') ?? undefined;
        const retryable = idempotent && (response.status === 429 || response.status >= 500) && attempt < this.config.maxRetries;
        if (!retryable) throw new SegmentApiError(response.status, `Segment API request failed with HTTP ${response.status}`, retryAfter, payload);
        const delayMs = retryAfter && /^\d+$/.test(retryAfter) ? Number(retryAfter) * 1000 : Math.min(1000 * 2 ** attempt, 8000);
        await new Promise(resolve => setTimeout(resolve, delayMs));
        attempt += 1;
      } catch (error) {
        if (error instanceof SegmentApiError) throw error;
        if (signal?.aborted) throw new Error('Request cancelled');
        if (attempt >= this.config.maxRetries || !idempotent) throw error;
        await new Promise(resolve => setTimeout(resolve, Math.min(1000 * 2 ** attempt, 8000)));
        attempt += 1;
      } finally {
        clearTimeout(timeout);
        signal?.removeEventListener('abort', onAbort);
      }
    }
  }

  get<T>(path: string, signal?: AbortSignal) { return this.request<T>('GET', path, undefined, signal); }
  post<T>(path: string, body: unknown, signal?: AbortSignal) { return this.request<T>('POST', path, body, signal); }
  patch<T>(path: string, body: unknown, signal?: AbortSignal) { return this.request<T>('PATCH', path, body, signal); }
  delete<T>(path: string, signal?: AbortSignal) { return this.request<T>('DELETE', path, undefined, signal); }
}
