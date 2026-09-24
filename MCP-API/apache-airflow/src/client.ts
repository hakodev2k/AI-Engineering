export type RequestOptions = { method?: 'GET'|'POST'; body?: unknown; signal?: AbortSignal; retryable?: boolean };

export class AirflowError extends Error {
  constructor(message: string, public status?: number, public retryAfter?: string) { super(message); }
}

export class AirflowClient {
  private base: string;
  constructor(
    baseUrl = process.env.AIRFLOW_BASE_URL,
    private token = process.env.AIRFLOW_TOKEN,
    private timeoutMs = Number(process.env.AIRFLOW_TIMEOUT_MS ?? 15000),
    private maxRetries = Number(process.env.AIRFLOW_MAX_RETRIES ?? 2),
    private fetchFn: typeof fetch = fetch,
  ) {
    if (!baseUrl) throw new Error('AIRFLOW_BASE_URL is required');
    if (!token) throw new Error('AIRFLOW_TOKEN is required');
    const u = new URL(baseUrl);
    if (u.protocol !== 'https:' && u.hostname !== 'localhost' && u.hostname !== '127.0.0.1') throw new Error('AIRFLOW_BASE_URL must use HTTPS except localhost');
    this.base = u.toString().replace(/\/$/, '') + '/api/v2';
  }

  async request(path: string, options: RequestOptions = {}): Promise<any> {
    if (!path.startsWith('/')) throw new Error('API path must be relative');
    const method = options.method ?? 'GET';
    const canRetry = options.retryable ?? method === 'GET';
    for (let attempt = 0; ; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeoutMs);
      const onAbort = () => controller.abort();
      options.signal?.addEventListener('abort', onAbort, { once: true });
      try {
        const res = await this.fetchFn(this.base + path, {
          method,
          headers: { Authorization: `Bearer ${this.token}`, Accept: 'application/json', ...(options.body ? {'Content-Type':'application/json'} : {}) },
          body: options.body ? JSON.stringify(options.body) : undefined,
          signal: controller.signal,
        });
        const text = await res.text();
        const data = text ? (() => { try { return JSON.parse(text); } catch { return { message: text }; } })() : {};
        if (res.ok) return data;
        const retryAfter = res.headers.get('retry-after') ?? undefined;
        if (canRetry && attempt < this.maxRetries && (res.status === 429 || res.status >= 500)) {
          const wait = retryAfter ? Math.min(Number(retryAfter) * 1000, 10000) : Math.min(250 * 2 ** attempt, 2000);
          await new Promise(r => setTimeout(r, Number.isFinite(wait) ? wait : 500));
          continue;
        }
        throw new AirflowError(data.detail ?? data.message ?? `Airflow API ${res.status}`, res.status, retryAfter);
      } catch (e) {
        if (e instanceof AirflowError) throw e;
        if (attempt < this.maxRetries && canRetry && !options.signal?.aborted) { await new Promise(r => setTimeout(r, Math.min(250 * 2 ** attempt, 2000))); continue; }
        if (e instanceof Error && e.name === 'AbortError') throw new AirflowError('Airflow request timed out or was cancelled');
        throw e;
      } finally {
        clearTimeout(timer);
        options.signal?.removeEventListener('abort', onAbort);
      }
    }
  }
}

export const qs = (values: Record<string, string|number|boolean|undefined>) => {
  const p = new URLSearchParams();
  for (const [k,v] of Object.entries(values)) if (v !== undefined) p.set(k, String(v));
  const s = p.toString(); return s ? `?${s}` : '';
};
export const seg = (v: string) => encodeURIComponent(v);
