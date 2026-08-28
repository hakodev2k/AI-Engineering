export class CloudsmithError extends Error {
  constructor(message, meta={}) { super(message); this.name = "CloudsmithError"; Object.assign(this, meta); }
}

const RETRYABLE = new Set([429, 502, 503, 504]);

function sleep(ms, signal) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => { clearTimeout(timer); reject(signal.reason || new Error("Aborted")); }, { once: true });
  });
}

export class CloudsmithClient {
  constructor(config, fetchImpl=globalThis.fetch) { this.config = config; this.fetch = fetchImpl; }

  async request(method, path, { query, body, signal, retrySafe=true }={}) {
    const url = new URL(`/v1${path}`, this.config.baseUrl);
    if (query) for (const [k,v] of Object.entries(query)) {
      if (v === undefined || v === null || v === "") continue;
      url.searchParams.set(k, Array.isArray(v) ? v.join(",") : String(v));
    }

    for (let attempt=0;;attempt++) {
      const timeout = AbortSignal.timeout(this.config.timeoutMs);
      const combined = signal ? AbortSignal.any([signal, timeout]) : timeout;
      let res;
      try {
        res = await this.fetch(url, {
          method,
          headers: { Authorization: `token ${this.config.apiKey}`, Accept: "application/json", ...(body === undefined ? {} : { "Content-Type": "application/json" }) },
          body: body === undefined ? undefined : JSON.stringify(body),
          signal: combined
        });
      } catch (err) {
        if (!retrySafe || combined.aborted || attempt >= this.config.maxRetries) throw err;
        await sleep(Math.min(250 * (2 ** attempt), 4000), signal);
        continue;
      }

      const text = await res.text();
      let data = null;
      if (text) { try { data = JSON.parse(text); } catch { data = { raw: text }; } }
      const rateLimit = {
        limit: res.headers.get("x-ratelimit-limit"),
        remaining: res.headers.get("x-ratelimit-remaining"),
        reset: res.headers.get("x-ratelimit-reset"),
        interval: res.headers.get("x-ratelimit-interval"),
        retryAfter: res.headers.get("retry-after")
      };
      const pagination = {
        count: res.headers.get("x-pagination-count"),
        page: res.headers.get("x-pagination-page"),
        pageTotal: res.headers.get("x-pagination-pagetotal"),
        pageSize: res.headers.get("x-pagination-pagesize"),
        link: res.headers.get("link")
      };
      if (res.ok) return { data, pagination, rateLimit };

      if (retrySafe && RETRYABLE.has(res.status) && attempt < this.config.maxRetries) {
        const retryAfter = Number(rateLimit.retryAfter);
        const wait = Number.isFinite(retryAfter) ? Math.min(retryAfter * 1000, 10000) : Math.min(250 * (2 ** attempt), 4000);
        await sleep(wait, signal);
        continue;
      }
      throw new CloudsmithError(data?.detail || `Cloudsmith HTTP ${res.status}`, { status: res.status, fields: data?.fields, rateLimit });
    }
  }

  listNamespaces(a,s){ return this.request("GET","/namespaces/",{query:{page:a.page,page_size:a.pageSize},signal:s}); }
  listRepositories(a,s){ return this.request("GET",`/repos/${enc(a.owner)}/`,{query:{page:a.page,page_size:a.pageSize,query:a.query,sort:a.sort},signal:s}); }
  listPackages(a,s){ return this.request("GET",`/packages/${enc(a.owner)}/${enc(a.repo)}/`,{query:{page:a.page,page_size:a.pageSize,query:a.query,sort:a.sort,include_connected_repositories:a.includeConnectedRepositories},signal:s}); }
  getPackage(a,s){ return this.request("GET",`/packages/${enc(a.owner)}/${enc(a.repo)}/${enc(a.identifier)}/`,{query:{include_connected_repositories:a.includeConnectedRepositories},signal:s}); }
  dependencies(a,s){ return this.request("GET",`/packages/${enc(a.owner)}/${enc(a.repo)}/${enc(a.identifier)}/dependencies/`,{query:{include_connected_repositories:a.includeConnectedRepositories},signal:s}); }
  vulnerabilities(a,s){ return this.request("GET",`/vulnerabilities/${enc(a.owner)}/${enc(a.repo)}/${enc(a.identifier)}/`,{query:{page:a.page,page_size:a.pageSize},signal:s}); }
  metrics(a,s){ return this.request("GET",`/metrics/packages/${enc(a.owner)}/${enc(a.repo)}/`,{query:{page:a.page,page_size:a.pageSize,start:a.start,finish:a.finish,packages:a.packages},signal:s}); }
  copy(a,s){ return this.request("POST",`/packages/${enc(a.owner)}/${enc(a.repo)}/${enc(a.identifier)}/copy/`,{body:{destination:a.destination,republish:a.republish??false},signal:s,retrySafe:false}); }
  move(a,s){ return this.request("POST",`/packages/${enc(a.owner)}/${enc(a.repo)}/${enc(a.identifier)}/move/`,{body:{destination:a.destination},signal:s,retrySafe:false}); }
  quarantine(a,s){ return this.request("POST",`/packages/${enc(a.owner)}/${enc(a.repo)}/${enc(a.identifier)}/quarantine/`,{body:{release:false},signal:s,retrySafe:false}); }
  release(a,s){ return this.request("POST",`/packages/${enc(a.owner)}/${enc(a.repo)}/${enc(a.identifier)}/quarantine/`,{body:{release:true},signal:s,retrySafe:false}); }
  delete(a,s){ return this.request("DELETE",`/packages/${enc(a.owner)}/${enc(a.repo)}/${enc(a.identifier)}/`,{signal:s,retrySafe:false}); }
}

function enc(v){ return encodeURIComponent(String(v)); }
