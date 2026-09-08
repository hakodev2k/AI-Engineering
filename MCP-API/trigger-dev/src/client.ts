import { config } from './config.js';

export class TriggerApiError extends Error {
  constructor(public status: number, message: string, public retryAfterMs?: number, public body?: unknown) {
    super(message);
    this.name = 'TriggerApiError';
  }
}

function sleep(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const t = setTimeout(resolve, ms);
    signal?.addEventListener('abort', () => { clearTimeout(t); reject(signal.reason ?? new Error('Aborted')); }, { once: true });
  });
}

export class TriggerClient {
  constructor(private fetchImpl: typeof fetch = fetch) {
    if (!config.secretKey) throw new Error('TRIGGER_SECRET_KEY is required');
    const u = new URL(config.apiUrl);
    if (u.protocol !== 'https:' && u.hostname !== 'localhost' && u.hostname !== '127.0.0.1') {
      throw new Error('TRIGGER_API_URL must use HTTPS unless localhost');
    }
  }

  async request<T>(method: string, path: string, body?: unknown, signal?: AbortSignal, retryable = true): Promise<T> {
    const url = new URL(path, `${config.apiUrl}/`);
    const allowed = new URL(config.apiUrl);
    if (url.origin !== allowed.origin) throw new Error('Cross-origin request blocked');

    for (let attempt = 0; ; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(new Error('Trigger.dev request timeout')), config.timeoutMs);
      const onAbort = () => controller.abort(signal?.reason);
      signal?.addEventListener('abort', onAbort, { once: true });
      try {
        const res = await this.fetchImpl(url, {
          method,
          headers: {
            Authorization: `Bearer ${config.secretKey}`,
            Accept: 'application/json',
            ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
          },
          body: body === undefined ? undefined : JSON.stringify(body),
          signal: controller.signal,
        });
        const text = await res.text();
        const parsed = text ? (() => { try { return JSON.parse(text); } catch { return { raw: text }; } })() : {};
        if (res.ok) return parsed as T;

        const retryAfter = res.headers.get('retry-after');
        const reset = res.headers.get('x-ratelimit-reset');
        let retryAfterMs = retryAfter ? Number(retryAfter) * 1000 : undefined;
        if (!retryAfterMs && reset) {
          const epoch = Number(reset);
          if (Number.isFinite(epoch)) retryAfterMs = Math.max(0, epoch * 1000 - Date.now());
        }
        const err = new TriggerApiError(res.status, `Trigger.dev API ${res.status}`, retryAfterMs, parsed);
        const canRetry = retryable && method === 'GET' && (res.status === 429 || res.status >= 500) && attempt < config.maxRetries;
        if (!canRetry) throw err;
        await sleep(Math.min(retryAfterMs ?? (250 * 2 ** attempt), 30_000), signal);
      } finally {
        clearTimeout(timer);
        signal?.removeEventListener('abort', onAbort);
      }
    }
  }

  triggerTask(task: string, payload: unknown, options: Record<string, unknown> = {}, signal?: AbortSignal) {
    return this.request<{ id: string }>('POST', `/api/v1/tasks/${encodeURIComponent(task)}/trigger`, { payload, options }, signal, false);
  }
  batchTriggerTask(task: string, items: Array<{ payload: unknown; options?: Record<string, unknown> }>, signal?: AbortSignal) {
    return this.request<{ batchId: string; runs: string[] }>('POST', `/api/v1/tasks/${encodeURIComponent(task)}/batch`, { items }, signal, false);
  }
  listRuns(query = '', signal?: AbortSignal) { return this.request<any>('GET', `/api/v1/runs${query}`, undefined, signal); }
  getRun(id: string, signal?: AbortSignal) { return this.request<any>('GET', `/api/v3/runs/${encodeURIComponent(id)}`, undefined, signal); }
  cancelRun(id: string, signal?: AbortSignal) { return this.request<any>('POST', `/api/v2/runs/${encodeURIComponent(id)}/cancel`, undefined, signal, false); }
  replayRun(id: string, signal?: AbortSignal) { return this.request<any>('POST', `/api/v1/runs/${encodeURIComponent(id)}/replay`, undefined, signal, false); }
  rescheduleRun(id: string, delay: string, signal?: AbortSignal) { return this.request<any>('POST', `/api/v1/runs/${encodeURIComponent(id)}/reschedule`, { delay }, signal, false); }
  getBatch(id: string, signal?: AbortSignal) { return this.request<any>('GET', `/api/v1/batches/${encodeURIComponent(id)}`, undefined, signal); }
  getBatchResults(id: string, signal?: AbortSignal) { return this.request<any>('GET', `/api/v1/batches/${encodeURIComponent(id)}/results`, undefined, signal); }
  listSchedules(page?: number, perPage?: number, signal?: AbortSignal) {
    const q = new URLSearchParams(); if (page) q.set('page', String(page)); if (perPage) q.set('perPage', String(perPage));
    return this.request<any>('GET', `/api/v1/schedules${q.size ? `?${q}` : ''}`, undefined, signal);
  }
  getSchedule(id: string, signal?: AbortSignal) { return this.request<any>('GET', `/api/v1/schedules/${encodeURIComponent(id)}`, undefined, signal); }
}
