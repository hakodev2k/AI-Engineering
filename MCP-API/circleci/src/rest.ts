import type { Config } from './config.js';

export class CircleCiApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly retryAfterMs?: number,
    public readonly body?: unknown
  ) {
    super(message);
  }
}

export class CircleCiRestClient {
  constructor(private readonly config: Config, private readonly fetchImpl: typeof fetch = fetch) {}

  async request<T>(method: 'GET' | 'POST', path: string, body?: unknown, signal?: AbortSignal): Promise<T> {
    const idempotent = method === 'GET';
    const attempts = idempotent ? this.config.maxRetries + 1 : 1;
    let lastError: unknown;

    for (let attempt = 0; attempt < attempts; attempt++) {
      const timeout = AbortSignal.timeout(this.config.requestTimeoutMs);
      const combinedSignal = signal ? AbortSignal.any([signal, timeout]) : timeout;
      try {
        const response = await this.fetchImpl(`${this.config.apiBaseUrl}${path}`, {
          method,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Circle-Token': this.config.apiToken
          },
          body: body === undefined ? undefined : JSON.stringify(body),
          signal: combinedSignal
        });

        const text = await response.text();
        let parsed: unknown = undefined;
        if (text) {
          try { parsed = JSON.parse(text); } catch { parsed = text; }
        }

        if (response.ok) return parsed as T;

        const retryAfterMs = parseRetryAfter(response.headers.get('retry-after'));
        const error = new CircleCiApiError(`CircleCI API ${method} ${path} failed with ${response.status}`, response.status, retryAfterMs, parsed);
        if (!idempotent || !isRetryable(response.status) || attempt === attempts - 1) throw error;
        await delay(retryAfterMs ?? backoffMs(attempt), signal);
      } catch (error) {
        lastError = error;
        if (!idempotent || attempt === attempts - 1 || !isNetworkError(error)) throw error;
        await delay(backoffMs(attempt), signal);
      }
    }
    throw lastError instanceof Error ? lastError : new Error('CircleCI request failed');
  }

  getPipeline(id: string, signal?: AbortSignal): Promise<unknown> {
    return this.request('GET', `/pipeline/${encodeURIComponent(id)}`, undefined, signal);
  }

  triggerPipeline(projectSlug: string, branch?: string, tag?: string, parameters?: Record<string, boolean | number | string>, signal?: AbortSignal): Promise<unknown> {
    const vcs: Record<string, string> = {};
    if (branch) vcs.branch = branch;
    if (tag) vcs.tag = tag;
    const body: Record<string, unknown> = {};
    if (Object.keys(vcs).length) Object.assign(body, vcs);
    if (parameters && Object.keys(parameters).length) body.parameters = parameters;
    return this.request('POST', `/project/${encodeProjectSlug(projectSlug)}/pipeline`, body, signal);
  }
}

export function encodeProjectSlug(slug: string): string {
  return slug.split('/').map(encodeURIComponent).join('/');
}

function isRetryable(status: number): boolean {
  return status === 429 || status === 502 || status === 503 || status === 504;
}

function isNetworkError(error: unknown): boolean {
  return error instanceof TypeError || (error instanceof Error && ['AbortError', 'TimeoutError'].includes(error.name));
}

function backoffMs(attempt: number): number {
  return Math.min(4000, 250 * 2 ** attempt);
}

function parseRetryAfter(value: string | null): number | undefined {
  if (!value) return undefined;
  const seconds = Number(value);
  if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000);
  const date = Date.parse(value);
  return Number.isNaN(date) ? undefined : Math.max(0, date - Date.now());
}

function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    if (signal) {
      if (signal.aborted) {
        clearTimeout(timer);
        reject(signal.reason);
      } else {
        signal.addEventListener('abort', () => {
          clearTimeout(timer);
          reject(signal.reason);
        }, { once: true });
      }
    }
  });
}
