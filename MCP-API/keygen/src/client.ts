import type { Config } from './config.js';

export class KeygenError extends Error {
  constructor(message: string, public readonly status?: number, public readonly retryAfter?: number) { super(message); }
}

function retryAfterSeconds(value: string | null): number | undefined {
  if (!value) return undefined;
  const n = Number(value);
  if (Number.isFinite(n) && n >= 0) return Math.ceil(n);
  const date = Date.parse(value);
  if (Number.isNaN(date)) return undefined;
  return Math.max(0, Math.ceil((date - Date.now()) / 1000));
}

export class KeygenClient {
  constructor(private readonly config: Config, private readonly fetcher: typeof fetch = fetch) {}

  private url(path: string, query?: Record<string, string | number | boolean | undefined>): string {
    const u = new URL(`${this.config.baseUrl}/v1/accounts/${encodeURIComponent(this.config.account)}/${path.replace(/^\//, '')}`);
    for (const [k, v] of Object.entries(query ?? {})) if (v !== undefined) u.searchParams.set(k, String(v));
    return u.toString();
  }

  private async request(method: string, path: string, body?: unknown, query?: Record<string, string | number | boolean | undefined>): Promise<any> {
    const maxAttempts = method === 'GET' ? 3 : 1;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const res = await this.fetcher(this.url(path, query), {
          method,
          redirect: 'error',
          signal: controller.signal,
          headers: {
            Accept: 'application/vnd.api+json',
            Authorization: `Bearer ${this.config.token}`,
            ...(body === undefined ? {} : { 'Content-Type': 'application/vnd.api+json' })
          },
          body: body === undefined ? undefined : JSON.stringify(body)
        });
        const text = await res.text();
        const parsed = text ? JSON.parse(text) : null;
        if (res.ok) return parsed;
        const delay = retryAfterSeconds(res.headers.get('retry-after'));
        if (method === 'GET' && attempt < maxAttempts && (res.status === 429 || res.status >= 500)) {
          await new Promise(r => setTimeout(r, Math.min((delay ?? 2 ** (attempt - 1)) * 1000, 5000)));
          continue;
        }
        const detail = parsed?.errors?.[0]?.detail ?? parsed?.errors?.[0]?.title ?? `HTTP ${res.status}`;
        throw new KeygenError(`Keygen request failed: ${detail}`, res.status, delay);
      } catch (err) {
        if (err instanceof KeygenError) throw err;
        if ((err as Error).name === 'AbortError') throw new KeygenError(`Keygen request timed out after ${this.config.timeoutMs}ms`);
        if (attempt === maxAttempts) throw new KeygenError(`Keygen network error: ${(err as Error).message}`);
      } finally { clearTimeout(timer); }
    }
    throw new KeygenError('Keygen request failed');
  }

  listLicenses(limit = 25, page = 1, status?: string) { return this.request('GET', 'licenses', undefined, { limit, page, status }); }
  getLicense(id: string) { return this.request('GET', `licenses/${encodeURIComponent(id)}`); }
  validateLicense(id: string, fingerprint?: string) {
    const meta = fingerprint ? { scope: { fingerprints: [fingerprint] } } : {};
    return this.request('POST', `licenses/${encodeURIComponent(id)}/actions/validate`, { meta });
  }
  createLicense(policyId: string, name?: string, expiry?: string) {
    return this.request('POST', 'licenses', {
      data: {
        type: 'licenses',
        attributes: { ...(name ? { name } : {}), ...(expiry ? { expiry } : {}) },
        relationships: { policy: { data: { type: 'policies', id: policyId } } }
      }
    });
  }
  suspendLicense(id: string) { return this.request('POST', `licenses/${encodeURIComponent(id)}/actions/suspend`); }
  reinstateLicense(id: string) { return this.request('POST', `licenses/${encodeURIComponent(id)}/actions/reinstate`); }
  listMachines(limit = 25, page = 1, license?: string) { return this.request('GET', 'machines', undefined, { limit, page, license }); }
  deactivateMachine(id: string) { return this.request('DELETE', `machines/${encodeURIComponent(id)}`); }
}
