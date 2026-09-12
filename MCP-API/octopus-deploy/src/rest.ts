import type { OctopusConfig } from './config.js';

export class OctopusApiError extends Error {
  constructor(public readonly status: number, message: string, public readonly body?: unknown) {
    super(message);
    this.name = 'OctopusApiError';
  }
}

export class OctopusRestClient {
  constructor(
    private readonly config: OctopusConfig,
    private readonly fetchImpl: typeof fetch = fetch
  ) {}

  async get<T>(path: string, query?: Record<string, string | number | boolean | undefined>): Promise<T> {
    return this.request<T>('GET', path, undefined, query);
  }

  async post<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>('POST', path, body);
  }

  private async request<T>(method: 'GET' | 'POST', path: string, body?: unknown, query?: Record<string, string | number | boolean | undefined>): Promise<T> {
    const url = new URL(`${this.config.baseUrl}/api${path.startsWith('/') ? path : `/${path}`}`);
    for (const [key, value] of Object.entries(query ?? {})) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }

    let attempt = 0;
    while (true) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const response = await this.fetchImpl(url, {
          method,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-Octopus-ApiKey': this.config.apiKey
          },
          body: body === undefined ? undefined : JSON.stringify(body),
          signal: controller.signal
        });

        const text = await response.text();
        const parsed = text ? safeJson(text) : undefined;
        if (response.ok) return parsed as T;

        const retryable = response.status === 429 || response.status >= 500;
        if (!retryable || attempt >= this.config.maxRetries) {
          throw new OctopusApiError(response.status, `Octopus API request failed with HTTP ${response.status}`, parsed);
        }
        const retryAfter = Number(response.headers.get('retry-after'));
        const waitMs = Number.isFinite(retryAfter) && retryAfter >= 0 ? retryAfter * 1000 : Math.min(500 * 2 ** attempt, 5000);
        await sleep(waitMs);
        attempt += 1;
      } catch (error) {
        if (error instanceof OctopusApiError) throw error;
        if (attempt >= this.config.maxRetries || method !== 'GET') throw error;
        await sleep(Math.min(500 * 2 ** attempt, 5000));
        attempt += 1;
      } finally {
        clearTimeout(timeout);
      }
    }
  }
}

function safeJson(text: string): unknown {
  try { return JSON.parse(text); } catch { return { raw: text }; }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
