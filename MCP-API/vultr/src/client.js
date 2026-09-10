const REDACT_KEYS = /^(default_password|password|token|secret|api_key|authorization|user_data|s3_access_key|s3_secret_key|console_url|vnc_url)$/i;

export class VultrApiError extends Error {
  constructor(message, { status = 0, retryAfter = null, providerCode = null } = {}) {
    super(message);
    this.name = "VultrApiError";
    this.status = status;
    this.retryAfter = retryAfter;
    this.providerCode = providerCode;
  }
}

export function redactProviderData(value) {
  if (Array.isArray(value)) return value.map(redactProviderData);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, REDACT_KEYS.test(k) ? "[REDACTED]" : redactProviderData(v)]));
  }
  return value;
}

function retryAfterMs(value) {
  if (!value) return null;
  if (/^\d+$/.test(value)) return Math.min(Number(value) * 1000, 30000);
  const t = Date.parse(value);
  return Number.isFinite(t) ? Math.max(0, Math.min(t - Date.now(), 30000)) : null;
}

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

export class VultrClient {
  constructor(config, fetchImpl = globalThis.fetch) {
    if (typeof fetchImpl !== "function") throw new Error("A fetch implementation is required");
    this.config = config;
    this.fetch = fetchImpl;
  }

  async request(method, path, { query, body, signal } = {}) {
    if (!/^\/[A-Za-z0-9_./-]*$/.test(path) || path.includes("..")) throw new Error("Unsafe Vultr API path");
    const url = new URL(this.config.apiBaseUrl + path);
    for (const [key, val] of Object.entries(query || {})) {
      if (val !== undefined && val !== null && val !== "") url.searchParams.set(key, String(val));
    }
    const retrySafe = method === "GET" || method === "HEAD";
    const attempts = retrySafe ? this.config.maxRetries + 1 : 1;
    let lastError;
    for (let attempt = 0; attempt < attempts; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(new Error("Vultr request timed out")), this.config.timeoutMs);
      const abort = () => controller.abort(signal?.reason);
      signal?.addEventListener("abort", abort, { once: true });
      try {
        const response = await this.fetch(url, {
          method,
          headers: {
            "Authorization": `Bearer ${this.config.apiKey}`,
            "Accept": "application/json",
            ...(body === undefined ? {} : { "Content-Type": "application/json" })
          },
          body: body === undefined ? undefined : JSON.stringify(body),
          signal: controller.signal
        });
        const text = await response.text();
        let parsed = null;
        if (text) {
          try { parsed = JSON.parse(text); } catch { parsed = { message: text.slice(0, 2000) }; }
        }
        const retryAfter = retryAfterMs(response.headers.get("retry-after"));
        if (response.ok) {
          return {
            data: redactProviderData(parsed),
            rateLimit: {
              limit: response.headers.get("x-ratelimit-limit"),
              remaining: response.headers.get("x-ratelimit-remaining"),
              reset: response.headers.get("x-ratelimit-reset"),
              retryAfterMs: retryAfter
            },
            untrustedProviderContent: true
          };
        }
        const msg = parsed?.error || parsed?.message || `Vultr API HTTP ${response.status}`;
        const err = new VultrApiError(String(msg).slice(0, 2000), { status: response.status, retryAfter, providerCode: parsed?.error_code || null });
        if (retrySafe && attempt + 1 < attempts && [429, 502, 503, 504].includes(response.status)) {
          await sleep(retryAfter ?? Math.min(250 * (2 ** attempt), 4000));
          continue;
        }
        throw err;
      } catch (error) {
        if (error instanceof VultrApiError) throw error;
        lastError = error;
        if (!retrySafe || attempt + 1 >= attempts || signal?.aborted) {
          if (controller.signal.aborted && !signal?.aborted) throw new VultrApiError("Vultr request timed out");
          throw new VultrApiError(`Vultr network error: ${error?.message || "unknown error"}`);
        }
        await sleep(Math.min(250 * (2 ** attempt), 4000));
      } finally {
        clearTimeout(timer);
        signal?.removeEventListener("abort", abort);
      }
    }
    throw lastError || new VultrApiError("Vultr request failed");
  }

  get(path, options) { return this.request("GET", path, options); }
  post(path, body, options = {}) { return this.request("POST", path, { ...options, body }); }
  patch(path, body, options = {}) { return this.request("PATCH", path, { ...options, body }); }
  delete(path, options) { return this.request("DELETE", path, options); }
}
