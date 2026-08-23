import type { HubSpotConfig } from './config.js';
import { HubSpotCredentialProvider } from './auth.js';

export type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH';
  query?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  retryable?: boolean;
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class HubSpotClient {
  private readonly credentials: HubSpotCredentialProvider;
  constructor(
    private readonly config: HubSpotConfig,
    private readonly fetchImpl: typeof fetch = fetch,
    credentialProvider?: HubSpotCredentialProvider
  ) {
    this.credentials = credentialProvider ?? new HubSpotCredentialProvider(config, fetchImpl);
  }

  async request<T = unknown>(path: string, options: RequestOptions = {}): Promise<T> {
    if (!path.startsWith('/') || path.includes('://')) throw new Error('VALIDATION_ERROR: invalid HubSpot API path');
    const method = options.method ?? 'GET';
    const retryable = options.retryable ?? method === 'GET';

    for (let attempt = 0; ; attempt++) {
      const token = await this.credentials.getToken(false);
      const url = new URL(path, 'https://api.hubapi.com');
      for (const [key, value] of Object.entries(options.query ?? {})) {
        if (value !== undefined) url.searchParams.set(key, String(value));
      }

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      let response: Response;
      try {
        response = await this.fetchImpl(url, {
          method,
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            ...(options.body === undefined ? {} : { 'Content-Type': 'application/json' })
          },
          body: options.body === undefined ? undefined : JSON.stringify(options.body)
        });
      } catch (error) {
        clearTimeout(timer);
        if (error instanceof Error && error.name === 'AbortError') throw new Error('TIMEOUT: HubSpot request exceeded configured timeout');
        if (retryable && attempt < this.config.maxRetries) {
          await sleep(Math.min(250 * 2 ** attempt, 2000));
          continue;
        }
        throw new Error(`NETWORK_ERROR: ${error instanceof Error ? error.message : String(error)}`);
      }
      clearTimeout(timer);

      if ((response.status === 429 || response.status >= 500) && retryable && attempt < this.config.maxRetries) {
        const retryAfter = Number(response.headers.get('retry-after'));
        const waitMs = Number.isFinite(retryAfter) && retryAfter >= 0
          ? Math.min(retryAfter * 1000, 10_000)
          : Math.min(250 * 2 ** attempt, 2000);
        await sleep(waitMs);
        continue;
      }

      const text = await response.text();
      const payload = text ? safeJson(text) : null;
      if (!response.ok) {
        const category = response.status === 401 ? 'AUTH_ERROR'
          : response.status === 403 ? 'PERMISSION_DENIED'
          : response.status === 429 ? 'RATE_LIMITED'
          : response.status >= 500 ? 'UPSTREAM_ERROR'
          : 'PROVIDER_ERROR';
        const correlation = response.headers.get('x-hubspot-correlation-id');
        throw new Error(`${category}: HTTP ${response.status}${correlation ? ` correlation=${correlation}` : ''} ${extractMessage(payload)}`.trim());
      }
      return payload as T;
    }
  }
}

function safeJson(text: string): unknown {
  try { return JSON.parse(text); } catch { return { raw: text.slice(0, 2000) }; }
}

function extractMessage(payload: unknown): string {
  if (payload && typeof payload === 'object' && 'message' in payload && typeof (payload as { message?: unknown }).message === 'string') {
    return (payload as { message: string }).message.slice(0, 1000);
  }
  return '';
}
