import type { OktaConfig } from './config.js';

export class OktaApiError extends Error {
  constructor(message: string, public readonly status: number, public readonly code?: string, public readonly retryAfterMs?: number) { super(message); }
}

type Json = Record<string, unknown> | unknown[] | null;
type RequestOptions = { method?: 'GET' | 'POST' | 'PUT' | 'DELETE'; body?: unknown; signal?: AbortSignal; retryable?: boolean };

export class OktaRestClient {
  constructor(private readonly config: OktaConfig, private readonly fetchImpl: typeof fetch = fetch) {}

  private authHeader(): string {
    if (this.config.accessToken) return `Bearer ${this.config.accessToken}`;
    if (this.config.apiToken) return `SSWS ${this.config.apiToken}`;
    throw new Error('REST fallback requires OKTA_ACCESS_TOKEN or OKTA_API_TOKEN');
  }

  private assertUrl(url: URL): void {
    const base = new URL(this.config.orgUrl);
    if (url.origin !== base.origin) throw new Error('Refusing cross-origin Okta pagination URL');
    if (!url.pathname.startsWith('/api/v1/')) throw new Error('Refusing non-management API URL');
  }

  async request(pathOrUrl: string, options: RequestOptions = {}): Promise<{ data: Json; headers: Headers; status: number }> {
    const method = options.method ?? 'GET';
    const url = pathOrUrl.startsWith('http') ? new URL(pathOrUrl) : new URL(pathOrUrl, `${this.config.orgUrl}/`);
    this.assertUrl(url);
    const canRetry = options.retryable ?? method === 'GET';
    let lastError: unknown;

    for (let attempt = 0; attempt <= this.config.maxRetries; attempt += 1) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(new Error('Okta request timed out')), this.config.timeoutMs);
      const onAbort = () => controller.abort(options.signal?.reason);
      options.signal?.addEventListener('abort', onAbort, { once: true });
      try {
        const response = await this.fetchImpl(url, {
          method,
          headers: { Authorization: this.authHeader(), Accept: 'application/json', ...(options.body === undefined ? {} : { 'Content-Type': 'application/json' }) },
          body: options.body === undefined ? undefined : JSON.stringify(options.body),
          signal: controller.signal
        });
        const text = await response.text();
        const data = text ? JSON.parse(text) as Json : null;
        if (response.ok) return { data, headers: response.headers, status: response.status };

        const body = (data && !Array.isArray(data) ? data : {}) as Record<string, unknown>;
        const code = typeof body.errorCode === 'string' ? body.errorCode : undefined;
        const summary = typeof body.errorSummary === 'string' ? body.errorSummary : `HTTP ${response.status}`;
        const retryAfter = response.headers.get('retry-after');
        const reset = response.headers.get('x-rate-limit-reset');
        const retryAfterMs = retryAfter ? Math.max(0, Number(retryAfter) * 1000) : reset ? Math.max(0, Number(reset) * 1000 - Date.now()) : undefined;
        const retryableStatus = response.status === 429 || response.status >= 500;
        if (!canRetry || !retryableStatus || attempt === this.config.maxRetries) throw new OktaApiError(summary, response.status, code, retryAfterMs);
        await new Promise((resolve) => setTimeout(resolve, retryAfterMs ?? Math.min(1000 * 2 ** attempt, 8000)));
      } catch (error) {
        lastError = error;
        if (error instanceof OktaApiError) throw error;
        if (!canRetry || attempt === this.config.maxRetries || options.signal?.aborted) throw error;
        await new Promise((resolve) => setTimeout(resolve, Math.min(500 * 2 ** attempt, 4000)));
      } finally {
        clearTimeout(timeout);
        options.signal?.removeEventListener('abort', onAbort);
      }
    }
    throw lastError instanceof Error ? lastError : new Error('Okta request failed');
  }

  async list(path: string, maxItems = 200, signal?: AbortSignal): Promise<unknown[]> {
    const output: unknown[] = [];
    let next: string | undefined = path;
    while (next && output.length < maxItems) {
      const response = await this.request(next, { signal, retryable: true });
      if (!Array.isArray(response.data)) throw new Error('Expected Okta list response');
      output.push(...response.data.slice(0, maxItems - output.length));
      next = parseNextLink(response.headers.get('link'));
    }
    return output;
  }
}

export function parseNextLink(link: string | null): string | undefined {
  if (!link) return undefined;
  for (const part of link.split(',')) {
    const match = part.trim().match(/^<([^>]+)>;\s*rel="?next"?$/i);
    if (match?.[1]) return match[1];
  }
  return undefined;
}
