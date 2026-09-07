const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export class CodaApiError extends Error {
  constructor(message, status, details, retryAfter) {
    super(message);
    this.name = 'CodaApiError';
    this.status = status;
    this.details = details;
    this.retryAfter = retryAfter;
  }
}

function retryAfterMs(value) {
  if (!value) return undefined;
  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds >= 0) return Math.min(seconds * 1000, 60000);
  const at = Date.parse(value);
  return Number.isNaN(at) ? undefined : Math.max(0, Math.min(at - Date.now(), 60000));
}

function safePath(path) {
  if (typeof path !== 'string' || !path.startsWith('/') || path.includes('://') || path.includes('..') || /[\r\n]/.test(path)) {
    throw new Error('Unsafe Coda API path rejected.');
  }
  return path;
}

export class CodaClient {
  constructor(config, fetchImpl = globalThis.fetch) {
    if (typeof fetchImpl !== 'function') throw new Error('A fetch implementation is required.');
    this.config = config;
    this.fetchImpl = fetchImpl;
  }

  async request(method, path, { query, body } = {}) {
    method = method.toUpperCase();
    const url = new URL(`${this.config.apiBaseUrl}${safePath(path)}`);
    for (const [key, value] of Object.entries(query || {})) {
      if (value === undefined || value === null || value === '') continue;
      if (Array.isArray(value)) url.searchParams.set(key, value.join(','));
      else url.searchParams.set(key, String(value));
    }
    const isRead = method === 'GET' || method === 'HEAD';
    let lastError;
    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const response = await this.fetchImpl(url, {
          method,
          headers: {
            Authorization: `Bearer ${this.config.apiToken}`,
            Accept: 'application/json',
            ...(body === undefined ? {} : { 'Content-Type': 'application/json' })
          },
          body: body === undefined ? undefined : JSON.stringify(body),
          signal: controller.signal
        });
        clearTimeout(timer);
        const text = await response.text();
        let data = null;
        if (text) {
          try { data = JSON.parse(text); } catch { data = { raw: text.slice(0, 4096) }; }
        }
        if (response.ok) {
          return {
            data,
            meta: {
              status: response.status,
              retryAfter: response.headers.get('retry-after') || undefined,
              source: 'untrusted_provider_data'
            }
          };
        }
        const retryMs = retryAfterMs(response.headers.get('retry-after'));
        const retryable = isRead && (response.status === 429 || response.status >= 500) && attempt < this.config.maxRetries;
        if (retryable) {
          await sleep(retryMs ?? Math.min(250 * (2 ** attempt), 4000));
          continue;
        }
        const message = data?.message || data?.error || `Coda API returned HTTP ${response.status}.`;
        throw new CodaApiError(String(message), response.status, data, response.headers.get('retry-after') || undefined);
      } catch (error) {
        clearTimeout(timer);
        if (error instanceof CodaApiError) throw error;
        const normalized = error?.name === 'AbortError' ? new Error('Coda API request timed out.') : new Error('Coda API network request failed.');
        lastError = normalized;
        if (!isRead || attempt >= this.config.maxRetries) throw normalized;
        await sleep(Math.min(250 * (2 ** attempt), 4000));
      }
    }
    throw lastError || new Error('Coda API request failed.');
  }
}
