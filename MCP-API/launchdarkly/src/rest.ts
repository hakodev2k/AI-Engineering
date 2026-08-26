import type { Config } from './config.js';

export class LaunchDarklyError extends Error {
  constructor(
    message: string,
    readonly status?: number,
    readonly code?: string,
    readonly retryAfterSeconds?: number,
    readonly details?: unknown
  ) {
    super(message);
  }
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const enc = (value: string) => encodeURIComponent(value);

export class LaunchDarklyRestClient {
  constructor(private readonly config: Config, private readonly fetchImpl: typeof fetch = fetch) {}

  private async request<T>(method: string, path: string, body?: unknown, query?: Record<string, string | number | boolean | undefined>): Promise<T> {
    if (!this.config.accessToken) throw new LaunchDarklyError('LAUNCHDARKLY_ACCESS_TOKEN is required for REST operations', 401, 'missing_credentials');
    const url = new URL(`${this.config.apiBaseUrl}${path}`);
    for (const [key, value] of Object.entries(query ?? {})) if (value !== undefined) url.searchParams.set(key, String(value));

    const safeToRetry = method === 'GET' || method === 'HEAD';
    const attempts = safeToRetry ? Math.max(1, this.config.maxRetries + 1) : 1;
    for (let attempt = 0; attempt < attempts; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const response = await this.fetchImpl(url, {
          method,
          signal: controller.signal,
          headers: {
            Authorization: this.config.accessToken,
            'LD-API-Version': this.config.apiVersion,
            Accept: 'application/json',
            ...(body !== undefined ? { 'Content-Type': 'application/json' } : {})
          },
          body: body === undefined ? undefined : JSON.stringify(body)
        });
        const text = await response.text();
        const payload = text ? (() => { try { return JSON.parse(text); } catch { return text; } })() : undefined;
        if (response.ok) return payload as T;

        const retryAfter = Number(response.headers.get('retry-after') ?? 0) || undefined;
        const retryable = safeToRetry && (response.status === 429 || response.status >= 500) && attempt + 1 < attempts;
        if (retryable) {
          const resetMs = Number(response.headers.get('x-ratelimit-reset') ?? 0);
          const waitMs = retryAfter ? retryAfter * 1000 : resetMs > Date.now() ? resetMs - Date.now() : Math.min(8000, 250 * 2 ** attempt);
          await sleep(waitMs + Math.floor(Math.random() * 150));
          continue;
        }
        const message = typeof payload === 'object' && payload && 'message' in payload ? String((payload as { message: unknown }).message) : `LaunchDarkly API returned HTTP ${response.status}`;
        throw new LaunchDarklyError(message, response.status, `http_${response.status}`, retryAfter, payload);
      } catch (error) {
        if (error instanceof LaunchDarklyError) throw error;
        if (error instanceof Error && error.name === 'AbortError') throw new LaunchDarklyError('LaunchDarkly request timed out', 408, 'timeout');
        if (safeToRetry && attempt + 1 < attempts) {
          await sleep(Math.min(8000, 250 * 2 ** attempt));
          continue;
        }
        throw new LaunchDarklyError(error instanceof Error ? error.message : 'LaunchDarkly network error', undefined, 'network_error');
      } finally {
        clearTimeout(timer);
      }
    }
    throw new LaunchDarklyError('LaunchDarkly request failed after bounded retries', undefined, 'retry_exhausted');
  }

  listProjects(limit = 20, offset = 0, filter?: string) { return this.request('GET', '/api/v2/projects', undefined, { limit, offset, filter }); }
  getProject(projectKey: string) { return this.request('GET', `/api/v2/projects/${enc(projectKey)}`); }
  listEnvironments(projectKey: string, limit = 20, offset = 0, filter?: string) { return this.request('GET', `/api/v2/projects/${enc(projectKey)}/environments`, undefined, { limit, offset, filter }); }

  listFlags(projectKey: string, limit = 20, offset = 0, env?: string, filter?: string) { return this.request('GET', `/api/v2/flags/${enc(projectKey)}`, undefined, { limit, offset, env, filter }); }
  getFlag(projectKey: string, flagKey: string, env?: string) { return this.request('GET', `/api/v2/flags/${enc(projectKey)}/${enc(flagKey)}`, undefined, { env }); }
  createFlag(projectKey: string, input: unknown) { return this.request('POST', `/api/v2/flags/${enc(projectKey)}`, input); }
  updateFlag(projectKey: string, flagKey: string, patch: unknown[]) { return this.request('PATCH', `/api/v2/flags/${enc(projectKey)}/${enc(flagKey)}`, patch); }
  deleteFlag(projectKey: string, flagKey: string) { return this.request('DELETE', `/api/v2/flags/${enc(projectKey)}/${enc(flagKey)}`); }

  listSegments(projectKey: string, environmentKey: string, limit = 20, offset = 0) { return this.request('GET', `/api/v2/segments/${enc(projectKey)}/${enc(environmentKey)}`, undefined, { limit, offset }); }
  getSegment(projectKey: string, environmentKey: string, segmentKey: string) { return this.request('GET', `/api/v2/segments/${enc(projectKey)}/${enc(environmentKey)}/${enc(segmentKey)}`); }
  createSegment(projectKey: string, environmentKey: string, input: unknown) { return this.request('POST', `/api/v2/segments/${enc(projectKey)}/${enc(environmentKey)}`, input); }
  updateSegment(projectKey: string, environmentKey: string, segmentKey: string, patch: unknown[]) { return this.request('PATCH', `/api/v2/segments/${enc(projectKey)}/${enc(environmentKey)}/${enc(segmentKey)}`, patch); }

  listWebhooks() { return this.request('GET', '/api/v2/webhooks'); }
  createWebhook(input: unknown) { return this.request('POST', '/api/v2/webhooks', input); }
  deleteWebhook(webhookId: string) { return this.request('DELETE', `/api/v2/webhooks/${enc(webhookId)}`); }
}
