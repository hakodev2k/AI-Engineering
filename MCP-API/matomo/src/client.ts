import type { MatomoConfig } from './config.js';

export const READ_METHODS = new Set([
  'SitesManager.getSitesWithAtLeastViewAccess',
  'VisitsSummary.get',
  'Actions.getPageUrls',
  'Referrers.getAll',
  'DevicesDetection.getType',
  'Events.getCategory',
  'UserCountry.getCountry',
  'VisitTime.getVisitInformationPerLocalTime',
  'VisitFrequency.get',
  'AIAgents.get'
]);

export class MatomoApiError extends Error {
  constructor(message: string, public readonly status?: number, public readonly retryAfterSeconds?: number) {
    super(message);
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class MatomoReportingClient {
  constructor(private readonly config: MatomoConfig, private readonly fetchImpl: typeof fetch = fetch) {}

  async call(method: string, params: Record<string, string | number | boolean | undefined> = {}): Promise<unknown> {
    if (!READ_METHODS.has(method)) throw new Error(`Matomo method is not allowlisted: ${method}`);
    const endpoint = new URL(`${this.config.baseUrl.toString().replace(/\/$/, '')}/index.php`);
    const form = new URLSearchParams({ module: 'API', method, format: 'JSON', token_auth: this.config.tokenAuth });
    for (const [key, value] of Object.entries(params)) if (value !== undefined) form.set(key, String(value));

    for (let attempt = 0; ; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const response = await this.fetchImpl(endpoint, {
          method: 'POST',
          headers: { 'content-type': 'application/x-www-form-urlencoded', accept: 'application/json' },
          body: form,
          signal: controller.signal
        });
        const retryAfter = this.retryAfter(response);
        if ((response.status === 429 || response.status >= 500) && attempt < this.config.maxRetries) {
          await sleep((retryAfter ?? Math.min(2 ** attempt, 8)) * 1000);
          continue;
        }
        if (!response.ok) throw new MatomoApiError(`Matomo HTTP ${response.status}`, response.status, retryAfter);
        const data = await response.json() as any;
        if (data && !Array.isArray(data) && data.result === 'error') throw new MatomoApiError(String(data.message ?? 'Matomo API error'));
        return data;
      } catch (error: any) {
        if (error?.name === 'AbortError') throw new MatomoApiError('Matomo request timed out');
        throw error;
      } finally {
        clearTimeout(timer);
      }
    }
  }

  private retryAfter(response: Response): number | undefined {
    const raw = response.headers.get('retry-after');
    if (!raw) return undefined;
    const seconds = Number(raw);
    return Number.isFinite(seconds) && seconds >= 0 ? Math.min(seconds, 60) : undefined;
  }
}
