import type { OpsLevelConfig } from './config.js';

export class OpsLevelError extends Error {
  constructor(message: string, public readonly code: string, public readonly status?: number, public readonly retryAfterMs?: number) { super(message); }
}

export class OpsLevelClient {
  constructor(private readonly config: OpsLevelConfig, private readonly fetchFn: typeof fetch = fetch) {}

  async query<T>(query: string, variables: Record<string, unknown> = {}, signal?: AbortSignal): Promise<T> {
    let attempt = 0;
    while (true) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), this.config.timeoutMs);
      const relay = () => controller.abort();
      signal?.addEventListener('abort', relay, { once: true });
      try {
        const response = await this.fetchFn(this.config.graphqlUrl, {
          method: 'POST',
          headers: { Authorization: `Bearer ${this.config.token}`, 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ query, variables }), signal: controller.signal
        });
        const retryAfterMs = parseRetryAfter(response.headers);
        if (response.status === 429 || response.status >= 500) {
          if (attempt < this.config.maxRetries) { await sleep(retryAfterMs ?? Math.min(500 * 2 ** attempt, 4000)); attempt++; continue; }
          throw new OpsLevelError('OpsLevel temporarily unavailable or rate limited', response.status === 429 ? 'RATE_LIMITED' : 'UPSTREAM_ERROR', response.status, retryAfterMs);
        }
        if (response.status === 401) throw new OpsLevelError('Invalid OpsLevel API token', 'AUTHENTICATION_FAILED', 401);
        if (response.status === 403) throw new OpsLevelError('OpsLevel permission denied', 'PERMISSION_DENIED', 403);
        if (!response.ok) throw new OpsLevelError(`OpsLevel HTTP ${response.status}`, 'UPSTREAM_ERROR', response.status);
        const payload = await response.json() as { data?: T; errors?: Array<{ message?: string }> };
        if (payload.errors?.length) throw new OpsLevelError(payload.errors.map(e => e.message || 'GraphQL error').join('; '), 'GRAPHQL_ERROR', response.status);
        if (!payload.data) throw new OpsLevelError('OpsLevel returned no data', 'INVALID_RESPONSE', response.status);
        return payload.data;
      } catch (error) {
        if (error instanceof OpsLevelError) throw error;
        if (controller.signal.aborted) throw new OpsLevelError('OpsLevel request timed out or was cancelled', 'TIMEOUT');
        if (attempt < this.config.maxRetries) { await sleep(Math.min(500 * 2 ** attempt, 4000)); attempt++; continue; }
        throw new OpsLevelError(error instanceof Error ? error.message : 'Network failure', 'NETWORK_ERROR');
      } finally {
        clearTimeout(timeout); signal?.removeEventListener('abort', relay);
      }
    }
  }
}

function parseRetryAfter(headers: Headers): number | undefined {
  const raw = headers.get('RateLimit-Retry-After') || headers.get('Retry-After');
  if (!raw) return undefined;
  const seconds = Number(raw);
  if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000);
  const date = Date.parse(raw); return Number.isNaN(date) ? undefined : Math.max(0, date - Date.now());
}
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
