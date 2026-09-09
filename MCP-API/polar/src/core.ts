import { setTimeout as sleep } from 'node:timers/promises';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK';
export type Config = { token: string; baseUrl: string; timeoutMs: number; requireWriteApproval: boolean };

export function loadConfig(env = process.env): Config {
  const token = env.POLAR_ACCESS_TOKEN?.trim();
  if (!token) throw new Error('POLAR_ACCESS_TOKEN is required');
  const environment = env.POLAR_ENVIRONMENT === 'production' ? 'production' : 'sandbox';
  const baseUrl = environment === 'production' ? 'https://api.polar.sh/v1' : 'https://sandbox-api.polar.sh/v1';
  const timeoutMs = Number(env.POLAR_TIMEOUT_MS ?? 20000);
  if (!Number.isFinite(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) throw new Error('Invalid POLAR_TIMEOUT_MS');
  return { token, baseUrl, timeoutMs, requireWriteApproval: env.POLAR_REQUIRE_WRITE_APPROVAL !== 'false' };
}

export function authorize(risk: Risk, approved: boolean | undefined, cfg: Config) {
  if (risk === 'READ') return;
  if (cfg.requireWriteApproval && approved !== true) throw new Error('APPROVAL_REQUIRED');
}

export class PolarApiError extends Error {
  constructor(public status: number, public code: string, public retryAfter?: number) { super(`${status}:${code}`); }
}

export class PolarClient {
  constructor(private cfg: Config, private fetchImpl: typeof fetch = fetch) {}
  async request(method: string, path: string, body?: unknown, query?: Record<string, unknown>) {
    const url = new URL(this.cfg.baseUrl + path);
    for (const [k, v] of Object.entries(query ?? {})) if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v));
    const maxAttempts = method === 'GET' ? 3 : 1;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.cfg.timeoutMs);
      try {
        const response = await this.fetchImpl(url, {
          method,
          headers: { Authorization: `Bearer ${this.cfg.token}`, Accept: 'application/json', 'Content-Type': 'application/json', 'User-Agent': 'ai-engineering-polar-connector/1.0' },
          body: body === undefined ? undefined : JSON.stringify(body),
          signal: controller.signal,
        });
        const text = await response.text();
        const data = text ? JSON.parse(text) : {};
        if (response.ok) return data;
        const retryAfter = Number(response.headers.get('retry-after') ?? 0) || undefined;
        if (method === 'GET' && attempt + 1 < maxAttempts && (response.status === 429 || response.status >= 500)) {
          await sleep(retryAfter ? Math.min(retryAfter * 1000, 10000) : 250 * 2 ** attempt);
          continue;
        }
        throw new PolarApiError(response.status, String(data?.detail?.[0]?.msg ?? data?.error ?? `http_${response.status}`), retryAfter);
      } finally { clearTimeout(timer); }
    }
    throw new Error('REQUEST_FAILED');
  }
}
