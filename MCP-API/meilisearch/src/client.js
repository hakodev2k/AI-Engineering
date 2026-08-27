export class MeilisearchError extends Error {
  constructor(message, { status, code, type, retryAfter } = {}) {
    super(message);
    this.name = "MeilisearchError";
    this.status = status;
    this.code = code;
    this.type = type;
    this.retryAfter = retryAfter;
  }
}

const RETRYABLE = new Set([429, 502, 503, 504]);

function sleep(ms, signal) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    if (signal) signal.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(signal.reason ?? new Error("Aborted"));
    }, { once: true });
  });
}

export class MeilisearchClient {
  constructor(config, fetchImpl = globalThis.fetch) {
    if (typeof fetchImpl !== "function") throw new Error("fetch implementation is required");
    this.config = config;
    this.fetch = fetchImpl;
  }

  async request(method, path, { query, body, signal, retrySafe = true } = {}) {
    const url = new URL(path, `${this.config.baseUrl}/`);
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value === undefined || value === null || value === "") continue;
        url.searchParams.set(key, Array.isArray(value) ? value.join(",") : String(value));
      }
    }

    let attempt = 0;
    while (true) {
      const timeout = AbortSignal.timeout(this.config.timeoutMs);
      const combined = signal ? AbortSignal.any([signal, timeout]) : timeout;
      let response;
      try {
        response = await this.fetch(url, {
          method,
          headers: {
            Authorization: `Bearer ${this.config.apiKey}`,
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

      const retryAfter = response.headers.get("retry-after") || undefined;
      if (retrySafe && RETRYABLE.has(response.status) && attempt < this.config.maxRetries) {
        const wait = retryAfter && /^\d+$/.test(retryAfter)
          ? Math.min(Number(retryAfter) * 1000, 10000)
          : Math.min(250 * (2 ** attempt), 4000);
        await sleep(wait, signal);
        attempt++;
        continue;
      }

      throw new MeilisearchError(
        data?.message || `Meilisearch request failed with HTTP ${response.status}`,
        { status: response.status, code: data?.code, type: data?.type, retryAfter }
      );
    }
  }

  health(signal) { return this.request("GET", "/health", { signal }); }
  version(signal) { return this.request("GET", "/version", { signal }); }
  listIndexes(args, signal) { return this.request("GET", "/indexes", { query: { offset: args.offset, limit: args.limit }, signal }); }
  getIndex(uid, signal) { return this.request("GET", `/indexes/${encodeURIComponent(uid)}`, { signal }); }
  createIndex(args, signal) {
    return this.request("POST", "/indexes", {
      body: { uid: args.uid, ...(args.primaryKey ? { primaryKey: args.primaryKey } : {}) }, signal, retrySafe: false
    });
  }
  updateIndex(args, signal) {
    return this.request("PATCH", `/indexes/${encodeURIComponent(args.uid)}`, {
      body: {
        ...(args.primaryKey !== undefined ? { primaryKey: args.primaryKey } : {}),
        ...(args.newUid !== undefined ? { uid: args.newUid } : {})
      }, signal, retrySafe: false
    });
  }
  deleteIndex(uid, signal) { return this.request("DELETE", `/indexes/${encodeURIComponent(uid)}`, { signal, retrySafe: false }); }

  search(args, signal) {
    const { uid, ...body } = args;
    return this.request("POST", `/indexes/${encodeURIComponent(uid)}/search`, { body, signal });
  }

  listDocuments(args, signal) {
    return this.request("GET", `/indexes/${encodeURIComponent(args.uid)}/documents`, {
      query: { offset: args.offset, limit: args.limit, fields: args.fields?.length ? args.fields.join(",") : undefined }, signal
    });
  }
  getDocument(args, signal) {
    return this.request("GET", `/indexes/${encodeURIComponent(args.uid)}/documents/${encodeURIComponent(String(args.documentId))}`, {
      query: { fields: args.fields?.length ? args.fields.join(",") : undefined }, signal
    });
  }
  addOrUpdateDocuments(args, signal) {
    return this.request("PUT", `/indexes/${encodeURIComponent(args.uid)}/documents`, {
      query: { primaryKey: args.primaryKey }, body: args.documents, signal, retrySafe: false
    });
  }
  deleteDocument(args, signal) {
    return this.request("DELETE", `/indexes/${encodeURIComponent(args.uid)}/documents/${encodeURIComponent(String(args.documentId))}`, {
      signal, retrySafe: false
    });
  }

  getSettings(uid, signal) { return this.request("GET", `/indexes/${encodeURIComponent(uid)}/settings`, { signal }); }
  updateSettings(args, signal) {
    return this.request("PATCH", `/indexes/${encodeURIComponent(args.uid)}/settings`, { body: args.settings, signal, retrySafe: false });
  }
  getTask(uid, signal) { return this.request("GET", `/tasks/${encodeURIComponent(String(uid))}`, { signal }); }
  listTasks(args, signal) {
    return this.request("GET", "/tasks", {
      query: { limit: args.limit, from: args.from, uids: args.uids, indexUids: args.indexUids, statuses: args.statuses, types: args.types }, signal
    });
  }
  cancelTasks(args, signal) {
    return this.request("POST", "/tasks/cancel", {
      query: { uids: args.uids, indexUids: args.indexUids, statuses: args.statuses, types: args.types }, signal, retrySafe: false
    });
  }
}
