export class BrevoError extends Error {
  constructor(message, { status, code, retryAfter, rateLimit } = {}) {
    super(message); this.name = 'BrevoError'; this.status = status; this.code = code; this.retryAfter = retryAfter; this.rateLimit = rateLimit;
  }
}
const RETRYABLE = new Set([429, 502, 503, 504]);
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export class BrevoClient {
  constructor(config, fetchImpl = globalThis.fetch) { this.config = config; this.fetch = fetchImpl; }
  async request(method, path, { query, body, signal, retrySafe = true } = {}) {
    const url = new URL(path, `${this.config.baseUrl}/`);
    for (const [key, value] of Object.entries(query || {})) {
      if (value == null || value === '') continue;
      url.searchParams.set(key, Array.isArray(value) ? value.join(',') : String(value));
    }
    let attempt = 0;
    while (true) {
      const timeout = AbortSignal.timeout(this.config.timeoutMs);
      const combined = signal ? AbortSignal.any([signal, timeout]) : timeout;
      let response;
      try {
        response = await this.fetch(url, {
          method,
          headers: { 'api-key': this.config.apiKey, Accept: 'application/json', ...(body === undefined ? {} : { 'Content-Type': 'application/json' }) },
          body: body === undefined ? undefined : JSON.stringify(body),
          signal: combined
        });
      } catch (error) {
        if (!retrySafe || attempt >= this.config.maxRetries || combined.aborted) throw error;
        await sleep(Math.min(250 * 2 ** attempt, 4000)); attempt++; continue;
      }
      const text = await response.text();
      let data = null;
      if (text) { try { data = JSON.parse(text); } catch { data = { raw: text }; } }
      const rateLimit = {
        limit: response.headers.get('x-sib-ratelimit-limit') || response.headers.get('x-ratelimit-limit') || undefined,
        remaining: response.headers.get('x-sib-ratelimit-remaining') || response.headers.get('x-ratelimit-remaining') || undefined,
        reset: response.headers.get('x-sib-ratelimit-reset') || response.headers.get('x-ratelimit-reset') || undefined
      };
      if (response.ok) return data;
      const retryAfter = response.headers.get('retry-after') || undefined;
      if (retrySafe && RETRYABLE.has(response.status) && attempt < this.config.maxRetries) {
        const delay = retryAfter && /^\d+$/.test(retryAfter) ? Math.min(Number(retryAfter) * 1000, 10000) : Math.min(250 * 2 ** attempt, 4000);
        await sleep(delay); attempt++; continue;
      }
      throw new BrevoError(data?.message || `Brevo request failed with HTTP ${response.status}`, { status: response.status, code: data?.code, retryAfter, rateLimit });
    }
  }
  esc(v) { return encodeURIComponent(String(v)); }
  getAccount(signal) { return this.request('GET', '/v3/account', { signal }); }
  listContacts(a, signal) { return this.request('GET', '/v3/contacts', { query: a, signal }); }
  getContact(a, signal) { return this.request('GET', `/v3/contacts/${this.esc(a.identifier)}`, { query: { identifierType: a.identifierType }, signal }); }
  createContact(a, signal) { return this.request('POST', '/v3/contacts', { body: a, signal, retrySafe: false }); }
  updateContact(a, signal) { const { identifier, identifierType, ...body } = a; return this.request('PUT', `/v3/contacts/${this.esc(identifier)}`, { query: { identifierType }, body, signal, retrySafe: false }); }
  listContactLists(a, signal) { return this.request('GET', '/v3/contacts/lists', { query: a, signal }); }
  listCampaigns(a, signal) { return this.request('GET', '/v3/emailCampaigns', { query: a, signal }); }
  getCampaign(a, signal) { return this.request('GET', `/v3/emailCampaigns/${this.esc(a.campaignId)}`, { query: { statistics: a.statistics, excludeHtmlContent: a.excludeHtmlContent }, signal }); }
  createCampaign(a, signal) { return this.request('POST', '/v3/emailCampaigns', { body: a, signal, retrySafe: false }); }
  sendCampaign(a, signal) { return this.request('POST', `/v3/emailCampaigns/${this.esc(a.campaignId)}/sendNow`, { signal, retrySafe: false }); }
  sendTransactionalEmail(a, signal) { return this.request('POST', '/v3/smtp/email', { body: a, signal, retrySafe: false }); }
  listWebhooks(a, signal) { return this.request('GET', '/v3/webhooks', { query: a, signal }); }
  createWebhook(a, signal) { return this.request('POST', '/v3/webhooks', { body: a, signal, retrySafe: false }); }
  deleteWebhook(a, signal) { return this.request('DELETE', `/v3/webhooks/${this.esc(a.webhookId)}`, { signal, retrySafe: false }); }
}
