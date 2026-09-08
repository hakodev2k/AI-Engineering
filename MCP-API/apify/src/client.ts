import { config } from './config.js';

export class ApifyError extends Error {
  constructor(public status: number, message: string, public retryAfterMs?: number) { super(message); }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'DELETE';
  query?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  accept?: string;
  signal?: AbortSignal;
};

const sleep = (ms: number, signal?: AbortSignal) => new Promise<void>((resolve, reject) => {
  const timer = setTimeout(resolve, ms);
  signal?.addEventListener('abort', () => { clearTimeout(timer); reject(signal.reason ?? new Error('aborted')); }, { once: true });
});

export class ApifyClient {
  constructor(private readonly fetchImpl: typeof fetch = fetch) {}

  async request<T = unknown>(path: string, options: RequestOptions = {}): Promise<T> {
    if (!path.startsWith('/')) throw new Error('API path must be relative and start with /');
    const url = new URL(config.baseUrl + path);
    for (const [k, v] of Object.entries(options.query ?? {})) if (v !== undefined) url.searchParams.set(k, String(v));
    const method = options.method ?? 'GET';
    const attempts = method === 'GET' ? config.maxRetries + 1 : 1;

    for (let attempt = 0; attempt < attempts; attempt++) {
      const timeout = new AbortController();
      const timer = setTimeout(() => timeout.abort(new Error('Apify request timed out')), config.timeoutMs);
      const abort = () => timeout.abort(options.signal?.reason ?? new Error('aborted'));
      options.signal?.addEventListener('abort', abort, { once: true });
      try {
        const headers: Record<string, string> = { Accept: options.accept ?? 'application/json' };
        if (config.token) headers.Authorization = `Bearer ${config.token}`;
        if (options.body !== undefined) headers['Content-Type'] = 'application/json';
        const res = await this.fetchImpl(url, {
          method,
          headers,
          body: options.body === undefined ? undefined : JSON.stringify(options.body),
          signal: timeout.signal,
        });
        const retryAfter = parseRetryAfter(res.headers.get('retry-after'));
        if (!res.ok) {
          const raw = await res.text();
          const msg = safeProviderMessage(raw, res.status);
          if (method === 'GET' && attempt + 1 < attempts && (res.status === 429 || res.status >= 500)) {
            await sleep(retryAfter ?? Math.min(500 * 2 ** attempt, 5000), options.signal);
            continue;
          }
          throw new ApifyError(res.status, msg, retryAfter);
        }
        if (res.status === 204) return undefined as T;
        const contentType = res.headers.get('content-type') ?? '';
        if (contentType.includes('application/json')) return await res.json() as T;
        return await res.text() as T;
      } finally {
        clearTimeout(timer);
        options.signal?.removeEventListener('abort', abort);
      }
    }
    throw new Error('request attempts exhausted');
  }

  account() { return this.request('/users/me'); }
  actor(id: string) { return this.request(`/actors/${encodeURIComponent(id)}`); }
  actorRuns(id: string, limit: number, offset: number, desc = true) { return this.request(`/actors/${encodeURIComponent(id)}/runs`, { query: { limit, offset, desc } }); }
  runActor(id: string, input: unknown) { return this.request(`/actors/${encodeURIComponent(id)}/runs`, { method: 'POST', body: input }); }
  task(id: string) { return this.request(`/actor-tasks/${encodeURIComponent(id)}`); }
  runTask(id: string, input: unknown) { return this.request(`/actor-tasks/${encodeURIComponent(id)}/runs`, { method: 'POST', body: input }); }
  run(id: string) { return this.request(`/actor-runs/${encodeURIComponent(id)}`); }
  abortRun(id: string) { return this.request(`/actor-runs/${encodeURIComponent(id)}/abort`, { method: 'POST' }); }
  runLog(id: string) { return this.request<string>(`/logs/${encodeURIComponent(id)}`, { accept: 'text/plain' }); }
  datasetItems(id: string, limit: number, offset: number, clean: boolean) { return this.request(`/datasets/${encodeURIComponent(id)}/items`, { query: { limit, offset, clean } }); }
  kvRecord(storeId: string, key: string) { return this.request(`/key-value-stores/${encodeURIComponent(storeId)}/records/${encodeURIComponent(key)}`); }
  webhooks(limit: number, offset: number, desc = true) { return this.request('/webhooks', { query: { limit, offset, desc } }); }
  createWebhook(body: unknown) { return this.request('/webhooks', { method: 'POST', body }); }
  deleteWebhook(id: string) { return this.request(`/webhooks/${encodeURIComponent(id)}`, { method: 'DELETE' }); }
}

function parseRetryAfter(value: string | null): number | undefined {
  if (!value) return undefined;
  const seconds = Number(value);
  if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000);
  const date = Date.parse(value);
  return Number.isFinite(date) ? Math.max(0, date - Date.now()) : undefined;
}

function safeProviderMessage(raw: string, status: number): string {
  try {
    const parsed = JSON.parse(raw) as { error?: { message?: string; type?: string } };
    const message = parsed.error?.message ?? parsed.error?.type;
    if (message) return `Apify API ${status}: ${message.slice(0, 500)}`;
  } catch { /* non-JSON body */ }
  return `Apify API ${status}: request failed`;
}
