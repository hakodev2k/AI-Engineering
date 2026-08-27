export class BrowserStackError extends Error {
  constructor(message, { status, retryAfter, rateLimit } = {}) {
    super(message);
    this.name = 'BrowserStackError';
    this.status = status;
    this.retryAfter = retryAfter;
    this.rateLimit = rateLimit;
  }
}

const SAFE_RETRY_STATUSES = new Set([429, 502, 503, 504]);

function sleep(ms, signal) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(signal.reason || new Error('Aborted'));
    }, { once: true });
  });
}

export class BrowserStackClient {
  constructor(config, fetchImpl = globalThis.fetch) {
    this.config = config;
    this.fetch = fetchImpl;
  }

  async request(method, path, { query, body, signal, retrySafe = true, accept = 'application/json' } = {}) {
    const url = new URL(path, `${this.config.baseUrl}/`);
    for (const [key, value] of Object.entries(query || {})) {
      if (value === undefined || value === null || value === '') continue;
      url.searchParams.set(key, String(value));
    }

    const auth = Buffer.from(`${this.config.username}:${this.config.accessKey}`).toString('base64');
    let attempt = 0;
    while (true) {
      const timeoutSignal = AbortSignal.timeout(this.config.timeoutMs);
      const combined = signal ? AbortSignal.any([signal, timeoutSignal]) : timeoutSignal;
      let response;
      try {
        response = await this.fetch(url, {
          method,
          headers: {
            Authorization: `Basic ${auth}`,
            Accept: accept,
            ...(body === undefined ? {} : { 'Content-Type': 'application/json' })
          },
          body: body === undefined ? undefined : JSON.stringify(body),
          signal: combined
        });
      } catch (error) {
        if (!retrySafe || attempt >= this.config.maxRetries || combined.aborted) throw error;
        await sleep(Math.min(250 * (2 ** attempt), 4000), signal);
        attempt++;
        continue;
      }

      const text = await response.text();
      const rateLimit = {
        tokenRemaining: response.headers.get('x-rate-limit-api-token-remaining') || undefined,
        keyRemaining: response.headers.get('x-rate-limit-api-key-remaining') || undefined
      };
      if (response.ok) {
        if (!text) return null;
        try { return JSON.parse(text); } catch { return { text }; }
      }

      const retryAfter = response.headers.get('retry-after') || undefined;
      if (retrySafe && SAFE_RETRY_STATUSES.has(response.status) && attempt < this.config.maxRetries) {
        const delay = retryAfter && /^\d+$/.test(retryAfter)
          ? Math.min(Number(retryAfter) * 1000, 10000)
          : Math.min(250 * (2 ** attempt), 4000);
        await sleep(delay, signal);
        attempt++;
        continue;
      }

      let message = text || `BrowserStack request failed with HTTP ${response.status}`;
      try {
        const parsed = JSON.parse(text);
        message = parsed.message || parsed.error || message;
      } catch {}
      throw new BrowserStackError(message, { status: response.status, retryAfter, rateLimit });
    }
  }

  getPlan(signal) { return this.request('GET', '/automate/plan.json', { signal }); }
  listBrowsers(signal) { return this.request('GET', '/automate/browsers.json', { signal }); }
  listProjects(signal) { return this.request('GET', '/automate/projects.json', { signal }); }
  getProject(id, signal) { return this.request('GET', `/automate/projects/${encodeURIComponent(id)}.json`, { signal }); }
  listBuilds(args, signal) { return this.request('GET', '/automate/builds.json', { query: { limit: args.limit, offset: args.offset }, signal }); }
  listSessions(args, signal) { return this.request('GET', `/automate/builds/${encodeURIComponent(args.buildId)}/sessions.json`, { query: { limit: args.limit, offset: args.offset }, signal }); }
  getSession(id, signal) { return this.request('GET', `/automate/sessions/${encodeURIComponent(id)}.json`, { signal }); }
  getLogs(id, signal) { return this.request('GET', `/automate/sessions/${encodeURIComponent(id)}/logs`, { signal, accept: 'text/plain' }); }
  getConsoleLogs(id, signal) { return this.request('GET', `/automate/sessions/${encodeURIComponent(id)}/consolelogs`, { signal, accept: 'text/plain' }); }
  getNetworkLogs(id, signal) { return this.request('GET', `/automate/sessions/${encodeURIComponent(id)}/networklogs`, { signal }); }
  updateSessionStatus(args, signal) { return this.request('PUT', `/automate/sessions/${encodeURIComponent(args.sessionId)}.json`, { body: { status: args.status, reason: args.reason }, signal, retrySafe: false }); }
  updateSessionName(args, signal) { return this.request('PUT', `/automate/sessions/${encodeURIComponent(args.sessionId)}.json`, { body: { name: args.name }, signal, retrySafe: false }); }
  deleteSession(id, signal) { return this.request('DELETE', `/automate/sessions/${encodeURIComponent(id)}.json`, { signal, retrySafe: false }); }
  deleteBuild(id, signal) { return this.request('DELETE', `/automate/builds/${encodeURIComponent(id)}.json`, { signal, retrySafe: false }); }
}
