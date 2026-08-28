export class KlaviyoError extends Error {
  constructor(message, details = {}) { super(message); this.name = 'KlaviyoError'; Object.assign(this, details); }
}
const RETRYABLE = new Set([429, 502, 503, 504]);
const sleep = ms => new Promise(r => setTimeout(r, ms));

export class KlaviyoClient {
  constructor(config, fetchImpl = globalThis.fetch) { this.config = config; this.fetch = fetchImpl; }
  async request(method, path, { query, body, signal, retrySafe = true } = {}) {
    const url = new URL(path, this.config.baseUrl);
    for (const [k, v] of Object.entries(query || {})) if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v));
    let attempt = 0;
    while (true) {
      const timeout = AbortSignal.timeout(this.config.timeoutMs);
      const combined = signal ? AbortSignal.any([signal, timeout]) : timeout;
      let response;
      try {
        response = await this.fetch(url, {
          method,
          headers: {
            Authorization: `Klaviyo-API-Key ${this.config.apiKey}`,
            revision: this.config.revision,
            Accept: 'application/vnd.api+json',
            ...(body === undefined ? {} : { 'Content-Type': 'application/vnd.api+json' })
          },
          body: body === undefined ? undefined : JSON.stringify(body),
          signal: combined
        });
      } catch (error) {
        if (!retrySafe || attempt >= this.config.maxRetries || combined.aborted) throw error;
        await sleep(Math.min(250 * 2 ** attempt, 4000)); attempt++; continue;
      }
      const text = await response.text();
      let data = null; if (text) { try { data = JSON.parse(text); } catch { data = { raw: text }; } }
      const rateLimit = {
        limit: response.headers.get('ratelimit-limit') || undefined,
        remaining: response.headers.get('ratelimit-remaining') || undefined,
        reset: response.headers.get('ratelimit-reset') || undefined,
        retryAfter: response.headers.get('retry-after') || undefined
      };
      if (response.ok) return { data, rateLimit };
      if (retrySafe && RETRYABLE.has(response.status) && attempt < this.config.maxRetries) {
        const retryMs = rateLimit.retryAfter && /^\d+$/.test(rateLimit.retryAfter) ? Math.min(Number(rateLimit.retryAfter) * 1000, 10000) : Math.min(250 * 2 ** attempt, 4000);
        await sleep(retryMs); attempt++; continue;
      }
      const err = data?.errors?.[0];
      throw new KlaviyoError(err?.detail || err?.title || `Klaviyo HTTP ${response.status}`, { status: response.status, code: err?.code, rateLimit });
    }
  }
  collection(resource, args, signal) {
    return this.request('GET', `/api/${resource}`, { query: { 'page[cursor]': args.cursor, 'page[size]': args.pageSize, filter: args.filter, sort: args.sort }, signal });
  }
  get(resource, id, signal) { return this.request('GET', `/api/${resource}/${encodeURIComponent(id)}`, { signal }); }
  profiles(args, s) { return this.collection('profiles', args, s); }
  profile(id, s) { return this.get('profiles', id, s); }
  lists(args, s) { return this.collection('lists', args, s); }
  list(id, s) { return this.get('lists', id, s); }
  segments(args, s) { return this.collection('segments', args, s); }
  segment(id, s) { return this.get('segments', id, s); }
  metrics(args, s) { return this.collection('metrics', args, s); }
  metric(id, s) { return this.get('metrics', id, s); }
  events(args, s) { return this.collection('events', args, s); }
  campaigns(args, s) { return this.collection('campaigns', args, s); }
  campaign(id, s) { return this.get('campaigns', id, s); }
  createEvent(args, s) {
    const attributes = { metric: { data: { type: 'metric', attributes: { name: args.metricName } } }, profile: { data: { type: 'profile', attributes: args.profile } }, ...(args.properties ? { properties: args.properties } : {}), ...(args.time ? { time: args.time } : {}), ...(args.value !== undefined ? { value: args.value } : {}), ...(args.uniqueId ? { unique_id: args.uniqueId } : {}) };
    return this.request('POST', '/api/events', { body: { data: { type: 'event', attributes } }, signal: s, retrySafe: false });
  }
}
