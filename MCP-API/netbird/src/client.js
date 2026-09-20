const sleep = (ms) => new Promise(r => setTimeout(r, ms));

export class NetBirdError extends Error {
  constructor(message, status, retryAfter) { super(message); this.name='NetBirdError'; this.status=status; this.retryAfter=retryAfter; }
}

export class NetBirdClient {
  constructor(env = process.env, fetchImpl = fetch) {
    this.base = (env.NETBIRD_API_URL || 'https://api.netbird.io').replace(/\/+$/, '');
    if (!/^https:\/\//i.test(this.base) && !/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(this.base)) throw new Error('NETBIRD_API_URL must use HTTPS (HTTP allowed only for localhost)');
    this.token = env.NETBIRD_TOKEN;
    if (!this.token) throw new Error('NETBIRD_TOKEN is required');
    this.authType = env.NETBIRD_AUTH_TYPE === 'oauth2' ? 'oauth2' : 'pat';
    this.account = env.NETBIRD_ACCOUNT_ID || '';
    this.timeout = Math.max(1000, Math.min(Number(env.NETBIRD_TIMEOUT_MS || 15000), 60000));
    this.maxRetries = Math.max(0, Math.min(Number(env.NETBIRD_MAX_RETRIES || 2), 4));
    this.fetch = fetchImpl;
  }

  async request(path, {method='GET', body, signal} = {}) {
    if (!path.startsWith('/')) throw new Error('Invalid API path');
    const url = new URL(`${this.base}/api${path}`);
    if (this.account) url.searchParams.set('account', this.account);
    const retryable = method === 'GET';
    for (let attempt=0;;attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(new Error('NetBird request timed out')), this.timeout);
      const abort = () => controller.abort(signal?.reason);
      signal?.addEventListener('abort', abort, {once:true});
      try {
        const res = await this.fetch(url, {
          method,
          signal: controller.signal,
          headers: {
            'Accept':'application/json',
            'Content-Type':'application/json',
            'Authorization': `${this.authType === 'oauth2' ? 'Bearer' : 'Token'} ${this.token}`
          },
          body: body === undefined ? undefined : JSON.stringify(body)
        });
        const text = await res.text();
        let data = null; try { data = text ? JSON.parse(text) : null; } catch { data = {message:text}; }
        if (res.ok) return data;
        const retryAfter = res.headers.get('retry-after');
        if (retryable && attempt < this.maxRetries && (res.status === 429 || res.status >= 500)) {
          const wait = retryAfter && /^\d+$/.test(retryAfter) ? Number(retryAfter)*1000 : Math.min(500 * 2**attempt, 4000);
          await sleep(wait); continue;
        }
        const msg = data?.message || data?.error || `NetBird API error ${res.status}`;
        throw new NetBirdError(msg, res.status, retryAfter);
      } finally {
        clearTimeout(timer); signal?.removeEventListener('abort', abort);
      }
    }
  }
}
