export class OpenAIHttpError extends Error {
  constructor(message, { status, code, type, param, requestId, retryAfterMs, body }) {
    super(message);
    this.name = 'OpenAIHttpError';
    this.status = status;
    this.code = code;
    this.type = type;
    this.param = param;
    this.requestId = requestId;
    this.retryAfterMs = retryAfterMs;
    this.body = body;
  }
}

function parseRetryAfter(value, now = Date.now()) {
  if (!value) return undefined;
  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds >= 0) return Math.ceil(seconds * 1000);
  const date = Date.parse(value);
  if (Number.isFinite(date)) return Math.max(0, date - now);
  return undefined;
}

function rateLimitMetadata(headers) {
  const names = [
    'x-ratelimit-limit-requests',
    'x-ratelimit-limit-tokens',
    'x-ratelimit-remaining-requests',
    'x-ratelimit-remaining-tokens',
    'x-ratelimit-reset-requests',
    'x-ratelimit-reset-tokens',
    'x-ratelimit-limit-project-tokens',
    'x-ratelimit-remaining-project-tokens',
    'x-ratelimit-reset-project-tokens'
  ];
  return Object.fromEntries(names.map(name => [name, headers.get(name)]).filter(([, value]) => value !== null));
}

function isActionRequiredRateLimit(error) {
  const code = String(error?.code ?? '').toLowerCase();
  const type = String(error?.type ?? '').toLowerCase();
  return [code, type].some(value =>
    value.includes('insufficient_quota') ||
    value.includes('billing') ||
    value.includes('hard_limit') ||
    value.includes('account_deactivated')
  );
}

export class OpenAIClient {
  constructor(config, options = {}) {
    this.config = config;
    this.fetchImpl = options.fetchImpl ?? globalThis.fetch;
    this.sleep = options.sleep ?? (ms => new Promise(resolve => setTimeout(resolve, ms)));
    this.random = options.random ?? Math.random;
    this.now = options.now ?? Date.now;
    if (typeof this.fetchImpl !== 'function') throw new Error('A fetch implementation is required');
  }

  headers(hasBody) {
    const headers = {
      Authorization: `Bearer ${this.config.apiKey}`,
      Accept: 'application/json'
    };
    if (hasBody) headers['Content-Type'] = 'application/json';
    if (this.config.project) headers['OpenAI-Project'] = this.config.project;
    if (this.config.organization) headers['OpenAI-Organization'] = this.config.organization;
    return headers;
  }

  async requestJson({ method, path, query, body, retrySafe = false, signal }) {
    if (!path.startsWith('/') || path.includes('://')) throw new Error('Only relative OpenAI API paths are allowed');
    const url = new URL(`${this.config.apiBase}${path}`);
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, String(value));
      }
    }

    const maxAttempts = retrySafe ? this.config.maxReadRetries + 1 : 1;
    let lastError;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const signals = [AbortSignal.timeout(this.config.timeoutMs)];
      if (signal) signals.push(signal);
      const combinedSignal = AbortSignal.any(signals);

      let response;
      try {
        response = await this.fetchImpl(url, {
          method,
          headers: this.headers(body !== undefined),
          body: body === undefined ? undefined : JSON.stringify(body),
          signal: combinedSignal
        });
      } catch (error) {
        if (combinedSignal.aborted) throw new Error('OpenAI request cancelled or timed out');
        lastError = error;
        if (!retrySafe || attempt + 1 >= maxAttempts) throw error;
        await this.sleep(Math.min(this.config.maxRetryDelayMs, 250 * 2 ** attempt + Math.floor(this.random() * 100)));
        continue;
      }

      const requestId = response.headers.get('x-request-id') ?? undefined;
      const text = await response.text();
      let data = null;
      if (text) {
        try { data = JSON.parse(text); }
        catch { data = { raw: text.slice(0, 20_000) }; }
      }

      if (response.ok) {
        return {
          data,
          meta: {
            requestId,
            rateLimit: rateLimitMetadata(response.headers)
          }
        };
      }

      const providerError = data?.error ?? {};
      const retryAfterMs = parseRetryAfter(response.headers.get('retry-after'), this.now());
      const httpError = new OpenAIHttpError(providerError.message ?? `OpenAI API returned HTTP ${response.status}`, {
        status: response.status,
        code: providerError.code,
        type: providerError.type,
        param: providerError.param,
        requestId,
        retryAfterMs,
        body: data
      });
      lastError = httpError;

      const transient = response.status === 429 || (response.status >= 500 && response.status <= 599);
      const mayRetry = retrySafe && transient && !isActionRequiredRateLimit(providerError) && attempt + 1 < maxAttempts;
      if (!mayRetry) throw httpError;

      let delayMs = retryAfterMs;
      if (delayMs === undefined) delayMs = 250 * 2 ** attempt + Math.floor(this.random() * 100);
      if (delayMs > this.config.maxRetryDelayMs) throw httpError;
      await this.sleep(delayMs);
    }
    throw lastError ?? new Error('OpenAI request failed');
  }

  listModels(signal) { return this.requestJson({ method: 'GET', path: '/models', retrySafe: true, signal }); }
  getModel(model, signal) { return this.requestJson({ method: 'GET', path: `/models/${encodeURIComponent(model)}`, retrySafe: true, signal }); }
  createResponse(body, signal) { return this.requestJson({ method: 'POST', path: '/responses', body, retrySafe: false, signal }); }
  getResponse(id, signal) { return this.requestJson({ method: 'GET', path: `/responses/${encodeURIComponent(id)}`, retrySafe: true, signal }); }
  cancelResponse(id, signal) { return this.requestJson({ method: 'POST', path: `/responses/${encodeURIComponent(id)}/cancel`, retrySafe: false, signal }); }
  createModeration(body, signal) { return this.requestJson({ method: 'POST', path: '/moderations', body, retrySafe: false, signal }); }
  createEmbedding(body, signal) { return this.requestJson({ method: 'POST', path: '/embeddings', body, retrySafe: false, signal }); }
  listVectorStores(query, signal) { return this.requestJson({ method: 'GET', path: '/vector_stores', query, retrySafe: true, signal }); }
  getVectorStore(id, signal) { return this.requestJson({ method: 'GET', path: `/vector_stores/${encodeURIComponent(id)}`, retrySafe: true, signal }); }
  createVectorStore(body, signal) { return this.requestJson({ method: 'POST', path: '/vector_stores', body, retrySafe: false, signal }); }
  searchVectorStore(id, body, signal) { return this.requestJson({ method: 'POST', path: `/vector_stores/${encodeURIComponent(id)}/search`, body, retrySafe: true, signal }); }
  listFiles(query, signal) { return this.requestJson({ method: 'GET', path: '/files', query, retrySafe: true, signal }); }
  getFile(id, signal) { return this.requestJson({ method: 'GET', path: `/files/${encodeURIComponent(id)}`, retrySafe: true, signal }); }
}

export { parseRetryAfter, rateLimitMetadata, isActionRequiredRateLimit };
