const sleep = ms => new Promise(r => setTimeout(r, ms));

export class TemporalCloudError extends Error {
  constructor(message, status, body, retryAfterSeconds) {
    super(message); this.name = 'TemporalCloudError'; this.status = status; this.body = body; this.retryAfterSeconds = retryAfterSeconds;
  }
}

export class TemporalCloudClient {
  constructor(config, fetchImpl = fetch) { this.config = config; this.fetch = fetchImpl; }

  async request(method, path, {query, body, retryable = method === 'GET'} = {}) {
    if (!path.startsWith('/cloud/')) throw new Error('Only fixed Temporal Cloud Ops API paths are allowed');
    const url = new URL(path, this.config.baseUrl);
    for (const [k, v] of Object.entries(query || {})) if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v));
    const attempts = retryable ? this.config.maxRetries + 1 : 1;
    let last;
    for (let attempt = 0; attempt < attempts; attempt++) {
      const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const res = await this.fetch(url, {
          method,
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Accept': 'application/json',
            ...(body === undefined ? {} : {'Content-Type': 'application/json'})
          },
          body: body === undefined ? undefined : JSON.stringify(body),
          signal: controller.signal
        });
        const text = await res.text();
        let parsed = text; try { parsed = text ? JSON.parse(text) : null; } catch {}
        if (res.ok) return parsed;
        const retryAfter = Number(res.headers.get('retry-after')) || undefined;
        const err = new TemporalCloudError(`Temporal Cloud API ${res.status}`, res.status, parsed, retryAfter);
        if (!retryable || ![429,502,503,504].includes(res.status) || attempt === attempts - 1) throw err;
        await sleep(Math.min(10000, retryAfter ? retryAfter * 1000 : 250 * (2 ** attempt)));
      } catch (e) {
        last = e;
        if (e?.name === 'AbortError') last = new TemporalCloudError(`Temporal Cloud request timed out after ${this.config.timeoutMs}ms`, 0, null);
        if (!retryable || attempt === attempts - 1 || (last instanceof TemporalCloudError && last.status && ![429,502,503,504].includes(last.status))) throw last;
        await sleep(Math.min(10000, 250 * (2 ** attempt)));
      } finally { clearTimeout(timer); }
    }
    throw last;
  }
}
