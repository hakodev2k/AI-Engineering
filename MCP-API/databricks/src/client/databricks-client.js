import { DatabricksTokenProvider } from "../auth/token-provider.js";

export class DatabricksError extends Error {
  constructor(message, { status, code, retryAfter } = {}) {
    super(message);
    this.name = "DatabricksError";
    this.status = status;
    this.code = code;
    this.retryAfter = retryAfter;
  }
}

const RETRYABLE = new Set([429, 502, 503, 504]);

function sleep(ms, signal) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(signal.reason ?? new Error("Aborted"));
    }, { once: true });
  });
}

export class DatabricksClient {
  constructor(config, { fetchImpl = globalThis.fetch, tokenProvider = null } = {}) {
    if (typeof fetchImpl !== "function") throw new Error("fetch implementation is required");
    this.config = config;
    this.fetch = fetchImpl;
    this.tokenProvider = tokenProvider || new DatabricksTokenProvider(config, fetchImpl);
  }

  async request(method, path, { query, body, signal, retrySafe = true, retryAuth = true } = {}) {
    const url = new URL(path, `${this.config.host}/`);
    for (const [key, value] of Object.entries(query || {})) {
      if (value === undefined || value === null || value === "") continue;
      url.searchParams.set(key, String(value));
    }

    let attempt = 0;
    while (true) {
      const token = await this.tokenProvider.getAccessToken(signal);
      const timeout = AbortSignal.timeout(this.config.timeoutMs);
      const combined = signal ? AbortSignal.any([signal, timeout]) : timeout;
      let response;
      try {
        response = await this.fetch(url, {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            ...(body === undefined ? {} : { "Content-Type": "application/json" })
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
      let data = null;
      if (text) {
        try { data = JSON.parse(text); } catch { data = { raw: text }; }
      }
      if (response.ok) return data;

      if (response.status === 401 && retryAuth && this.config.authMode === "oauth_m2m") {
        this.tokenProvider.invalidate();
        return this.request(method, path, { query, body, signal, retrySafe, retryAuth: false });
      }

      const retryAfter = response.headers.get("retry-after") || undefined;
      if (retrySafe && RETRYABLE.has(response.status) && attempt < this.config.maxRetries) {
        const delay = retryAfter && /^\d+$/.test(retryAfter)
          ? Math.min(Number(retryAfter) * 1000, 10000)
          : Math.min(250 * (2 ** attempt), 4000);
        await sleep(delay, signal);
        attempt++;
        continue;
      }

      throw new DatabricksError(
        data?.message || data?.error_description || `Databricks request failed with HTTP ${response.status}`,
        { status: response.status, code: data?.error_code || data?.code, retryAfter }
      );
    }
  }

  listClusters(a, signal) { return this.request("GET", "/api/2.1/clusters/list", { query: a, signal }); }
  getCluster(a, signal) { return this.request("GET", "/api/2.1/clusters/get", { query: { cluster_id: a.cluster_id }, signal }); }
  startCluster(a, signal) { return this.request("POST", "/api/2.1/clusters/start", { body: { cluster_id: a.cluster_id }, signal, retrySafe: false }); }
  restartCluster(a, signal) { return this.request("POST", "/api/2.1/clusters/restart", { body: { cluster_id: a.cluster_id }, signal, retrySafe: false }); }
  terminateCluster(a, signal) { return this.request("POST", "/api/2.1/clusters/delete", { body: { cluster_id: a.cluster_id }, signal, retrySafe: false }); }

  listJobs(a, signal) { return this.request("GET", "/api/2.2/jobs/list", { query: a, signal }); }
  getJob(a, signal) { return this.request("GET", "/api/2.2/jobs/get", { query: a, signal }); }
  listRuns(a, signal) { return this.request("GET", "/api/2.2/jobs/runs/list", { query: a, signal }); }
  getRun(a, signal) { return this.request("GET", "/api/2.2/jobs/runs/get", { query: a, signal }); }
  runJob(a, signal) {
    const body = { job_id: a.job_id };
    if (a.job_parameters !== undefined) body.job_parameters = a.job_parameters;
    if (a.idempotency_token !== undefined) body.idempotency_token = a.idempotency_token;
    return this.request("POST", "/api/2.2/jobs/run-now", { body, signal, retrySafe: Boolean(a.idempotency_token) });
  }
  cancelRun(a, signal) { return this.request("POST", "/api/2.2/jobs/runs/cancel", { body: { run_id: a.run_id }, signal, retrySafe: false }); }

  listWarehouses(a, signal) { return this.request("GET", "/api/2.0/sql/warehouses", { query: a, signal }); }
  getWarehouse(a, signal) { return this.request("GET", `/api/2.0/sql/warehouses/${encodeURIComponent(a.warehouse_id)}`, { signal }); }
  startWarehouse(a, signal) { return this.request("POST", `/api/2.0/sql/warehouses/${encodeURIComponent(a.warehouse_id)}/start`, { signal, retrySafe: false }); }
  stopWarehouse(a, signal) { return this.request("POST", `/api/2.0/sql/warehouses/${encodeURIComponent(a.warehouse_id)}/stop`, { signal, retrySafe: false }); }

  executeStatement(a, signal) {
    return this.request("POST", "/api/2.0/sql/statements", {
      body: { ...a, disposition: "INLINE", format: "JSON_ARRAY" },
      signal,
      retrySafe: false
    });
  }
  getStatement(a, signal) { return this.request("GET", `/api/2.0/sql/statements/${encodeURIComponent(a.statement_id)}`, { signal }); }
  cancelStatement(a, signal) { return this.request("POST", `/api/2.0/sql/statements/${encodeURIComponent(a.statement_id)}/cancel`, { signal, retrySafe: false }); }
}
