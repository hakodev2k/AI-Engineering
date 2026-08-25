export class BrevoError extends Error {
  constructor(message, { status, code, retryAfter, body } = {}) {
    super(message);
    this.name = 'BrevoError';
    this.status = status;
    this.code = code;
    this.retryAfter = retryAfter;
    this.body = body;
  }
}

export class BrevoClient {
  constructor(config, fetchImpl = globalThis.fetch) {
    if (!config.apiKey) throw new Error('BREVO_API_KEY is required');
    this.config = config;
    this.fetch = fetchImpl;
  }

  async request(method, path, { query, body, signal, retrySafe = true } = {}) {
    const url = new URL(`${this.config.baseUrl}${path.startsWith('/') ? path : `/${path}`}`);
    for (const [k, v] of Object.entries(query || {})) {
      if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v));
    }
    let last;
    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(new Error('Brevo request timed out')), this.config.timeoutMs);
      const onAbort = () => controller.abort(signal.reason);
      signal?.addEventListener('abort', onAbort, { once: true });
      try {
        const res = await this.fetch(url, {
          method,
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            'api-key': this.config.apiKey
          },
          body: body === undefined ? undefined : JSON.stringify(body),
          signal: controller.signal
        });
        const text = await res.text();
        const parsed = text ? safeJson(text) : null;
        if (res.ok) return { data: parsed, status: res.status, rateLimit: rateMeta(res.headers) };
        const retryAfter = parseRetryAfter(res.headers.get('retry-after'));
        const err = new BrevoError(parsed?.message || `Brevo API error ${res.status}`, {
          status: res.status,
          code: parsed?.code,
          retryAfter,
          body: parsed
        });
        if (!shouldRetry(res.status, method, retrySafe) || attempt === this.config.maxRetries) throw err;
        last = err;
        await sleep(retryAfter ?? Math.min(4000, 250 * 2 ** attempt));
      } catch (err) {
        if (err?.name === 'AbortError' || controller.signal.aborted) throw new BrevoError('Brevo request timed out or was cancelled');
        if (err instanceof BrevoError) throw err;
        last = err;
        if (!retrySafe || attempt === this.config.maxRetries) throw new BrevoError(`Brevo network error: ${err.message}`);
        await sleep(Math.min(4000, 250 * 2 ** attempt));
      } finally {
        clearTimeout(timer);
        signal?.removeEventListener('abort', onAbort);
      }
    }
    throw last;
  }
}

function safeJson(text) { try { return JSON.parse(text); } catch { return { raw: text }; } }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function shouldRetry(status, method, retrySafe) {
  if (!retrySafe) return false;
  return ['GET', 'HEAD'].includes(method) && (status === 429 || status === 408 || status >= 500);
}
function parseRetryAfter(value) {
  if (!value) return undefined;
  const seconds = Number(value);
  if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000);
  const date = Date.parse(value);
  return Number.isNaN(date) ? undefined : Math.max(0, date - Date.now());
}
function rateMeta(headers) {
  return {
    limit: headers.get('x-sib-ratelimit-limit') || headers.get('ratelimit-limit'),
    remaining: headers.get('x-sib-ratelimit-remaining') || headers.get('ratelimit-remaining'),
    reset: headers.get('x-sib-ratelimit-reset') || headers.get('ratelimit-reset'),
    retryAfter: headers.get('retry-after')
  };
}
