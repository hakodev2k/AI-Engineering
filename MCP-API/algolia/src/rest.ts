import { Config } from './config.js';

export class AlgoliaError extends Error {
  constructor(public status: number, message: string, public retryAfter?: number) { super(message); }
}

export class AlgoliaRest {
  constructor(private cfg: Config, private fetchFn: typeof fetch = fetch) {}

  async search(index: string, body: Record<string, unknown>) { return this.req('POST', `/1/indexes/${enc(index)}/query`, body, false); }
  async getRecord(index: string, objectID: string) { return this.req('GET', `/1/indexes/${enc(index)}/${enc(objectID)}`, undefined, false); }
  async listIndices(page = 0, hitsPerPage = 20) { return this.req('GET', `/1/indexes?page=${page}&hitsPerPage=${hitsPerPage}`, undefined, true); }
  async searchFacet(index: string, facet: string, body: Record<string, unknown>) { return this.req('POST', `/1/indexes/${enc(index)}/facets/${enc(facet)}/query`, body, false); }
  async getSettings(index: string) { return this.req('GET', `/1/indexes/${enc(index)}/settings`, undefined, true); }
  async saveRecord(index: string, record: Record<string, unknown>) {
    const id = String(record.objectID ?? '');
    if (!id) throw new Error('record.objectID is required');
    return this.req('PUT', `/1/indexes/${enc(index)}/${enc(id)}`, record, true);
  }
  async setSettings(index: string, settings: Record<string, unknown>) { return this.req('PUT', `/1/indexes/${enc(index)}/settings`, settings, true); }
  async deleteRecord(index: string, objectID: string) { return this.req('DELETE', `/1/indexes/${enc(index)}/${enc(objectID)}`, undefined, true, false); }

  async analytics(path: string, params: URLSearchParams) {
    const key = this.cfg.searchKey ?? this.cfg.adminKey;
    if (!key) throw new Error('ALGOLIA_SEARCH_API_KEY or ALGOLIA_ADMIN_API_KEY is required');
    return this.http(`https://analytics.us.algolia.com${path}?${params}`, 'GET', key, undefined, true);
  }

  private async req(method: string, path: string, body: unknown, admin: boolean, retrySafe = true) {
    const key = admin ? this.cfg.adminKey : (this.cfg.searchKey ?? this.cfg.adminKey);
    if (!key) throw new Error(admin ? 'ALGOLIA_ADMIN_API_KEY is required' : 'ALGOLIA_SEARCH_API_KEY or ALGOLIA_ADMIN_API_KEY is required');
    return this.http(`https://${this.cfg.appId}-dsn.algolia.net${path}`, method, key, body, retrySafe);
  }

  private async http(url: string, method: string, key: string, body?: unknown, retrySafe = true): Promise<any> {
    for (let attempt = 0; ; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.cfg.timeoutMs);
      try {
        const res = await this.fetchFn(url, {
          method,
          headers: {'content-type':'application/json','x-algolia-application-id':this.cfg.appId,'x-algolia-api-key':key},
          body: body === undefined ? undefined : JSON.stringify(body),
          signal: controller.signal
        });
        const text = await res.text();
        const data = text ? JSON.parse(text) : {};
        if (res.ok) return data;
        const retryAfter = parseRetryAfter(res.headers.get('retry-after'));
        const retryable = retrySafe && (res.status === 429 || res.status >= 500) && attempt < this.cfg.maxRetries;
        if (retryable) { await sleep(retryAfter ?? Math.min(250 * 2 ** attempt, 2000)); continue; }
        throw new AlgoliaError(res.status, data?.message ?? `Algolia request failed (${res.status})`, retryAfter);
      } catch (e) {
        if (e instanceof AlgoliaError) throw e;
        if (attempt < this.cfg.maxRetries && retrySafe) { await sleep(Math.min(250 * 2 ** attempt, 2000)); continue; }
        throw e;
      } finally { clearTimeout(timer); }
    }
  }
}

function enc(s: string) { return encodeURIComponent(s); }
function parseRetryAfter(v: string | null) { if (!v) return undefined; const n = Number(v); return Number.isFinite(n) ? n * 1000 : undefined; }
function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }
