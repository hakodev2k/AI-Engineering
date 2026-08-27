export class PostHogError extends Error {
  constructor(message, meta={}) { super(message); Object.assign(this, meta); this.name='PostHogError'; }
}
const RETRYABLE = new Set([429,502,503,504]);
const sleep = ms => new Promise(r => setTimeout(r, ms));
export class PostHogClient {
  constructor(config, fetchImpl=globalThis.fetch) { this.c=config; this.fetch=fetchImpl; }
  async request(method, path, { query, body, retrySafe=true }={}) {
    const url = new URL(path, `${this.c.baseUrl}/`);
    for (const [k,v] of Object.entries(query || {})) if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v));
    let attempt=0;
    while (true) {
      let res;
      try {
        res = await this.fetch(url, {
          method,
          headers: { Authorization:`Bearer ${this.c.apiKey}`, Accept:'application/json', ...(body===undefined?{}:{'Content-Type':'application/json'}) },
          body: body===undefined?undefined:JSON.stringify(body),
          signal: AbortSignal.timeout(this.c.timeoutMs)
        });
      } catch (e) {
        if (!retrySafe || attempt >= this.c.maxRetries) throw e;
        await sleep(Math.min(250*(2**attempt++), 4000));
        continue;
      }
      const text = await res.text(); let data=null;
      try { data = text ? JSON.parse(text) : null; } catch { data = { raw:text }; }
      if (res.ok) return data;
      const retryAfter = res.headers.get('retry-after');
      if (retrySafe && RETRYABLE.has(res.status) && attempt < this.c.maxRetries) {
        const wait = retryAfter && /^\d+$/.test(retryAfter) ? Math.min(Number(retryAfter)*1000, 10000) : Math.min(250*(2**attempt),4000);
        attempt++; await sleep(wait); continue;
      }
      throw new PostHogError(data?.detail || data?.error || `PostHog HTTP ${res.status}`, { status:res.status, code:data?.code, type:data?.type, retryAfter });
    }
  }
  p(s='') { return `/api/projects/${this.c.projectId}${s}`; }
  project() { return this.request('GET', this.p('/')); }
  dashboards(args) { return this.request('GET', this.p('/dashboards/'), { query:{limit:args.limit, offset:args.offset} }); }
  dashboard(id) { return this.request('GET', this.p(`/dashboards/${id}/`)); }
  insights(args) { return this.request('GET', this.p('/insights/'), { query:{limit:args.limit, offset:args.offset, search:args.search} }); }
  insight(id) { return this.request('GET', this.p(`/insights/${id}/`)); }
  flags(args) { return this.request('GET', this.p('/feature_flags/'), { query:{limit:args.limit, offset:args.offset, search:args.search} }); }
  flag(id) { return this.request('GET', this.p(`/feature_flags/${id}/`)); }
  createFlag(body) { return this.request('POST', this.p('/feature_flags/'), { body, retrySafe:false }); }
  updateFlag(id, body) { return this.request('PATCH', this.p(`/feature_flags/${id}/`), { body, retrySafe:false }); }
  deleteFlag(id) { return this.request('DELETE', this.p(`/feature_flags/${id}/`), { retrySafe:false }); }
  persons(args) { return this.request('GET', this.p('/persons/'), { query:{limit:args.limit, offset:args.offset, search:args.search} }); }
  person(id) { return this.request('GET', this.p(`/persons/${encodeURIComponent(id)}/`)); }
}
