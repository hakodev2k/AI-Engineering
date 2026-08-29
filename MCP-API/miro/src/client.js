const RETRYABLE = new Set([429, 502, 503, 504]);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export class MiroError extends Error {
  constructor(message, {status, retryAfter, details} = {}) {
    super(message);
    this.name = "MiroError";
    this.status = status;
    this.retryAfter = retryAfter;
    this.details = details;
  }
}

export class MiroClient {
  constructor(config, credentials, fetchImpl = globalThis.fetch) {
    this.config = config;
    this.credentials = credentials;
    this.fetch = fetchImpl;
  }

  async request(method, pathname, {query, body, signal, retrySafe = method === "GET"} = {}) {
    let attempt = 0;
    let refreshed = false;

    while (true) {
      const url = new URL(pathname, `${this.config.apiBaseUrl}/`);
      for (const [key, value] of Object.entries(query || {})) {
        if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, String(value));
      }

      const token = await this.credentials.getAccessToken();
      const timeout = AbortSignal.timeout(this.config.timeoutMs);
      const combined = signal ? AbortSignal.any([signal, timeout]) : timeout;
      let response;

      try {
        response = await this.fetch(url, {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            ...(body === undefined ? {} : {"Content-Type": "application/json"})
          },
          body: body === undefined ? undefined : JSON.stringify(body),
          signal: combined
        });
      } catch (error) {
        if (!retrySafe || attempt >= this.config.maxRetries || combined.aborted) throw error;
        await sleep(Math.min(250 * 2 ** attempt, 4000));
        attempt += 1;
        continue;
      }

      if (response.status === 401 && !refreshed && this.config.tokenFile) {
        await this.credentials.refresh();
        refreshed = true;
        continue;
      }

      const text = await response.text();
      let data = null;
      if (text) {
        try { data = JSON.parse(text); } catch { data = {raw: text}; }
      }

      if (response.ok) return data ?? {ok: true};

      const retryAfter = response.headers.get("retry-after") || undefined;
      if (retrySafe && RETRYABLE.has(response.status) && attempt < this.config.maxRetries) {
        const delay = retryAfter && /^\d+$/.test(retryAfter)
          ? Math.min(Number(retryAfter) * 1000, 10000)
          : Math.min(250 * 2 ** attempt, 4000);
        await sleep(delay);
        attempt += 1;
        continue;
      }

      throw new MiroError(
        data?.message || data?.error || `Miro request failed with HTTP ${response.status}`,
        {status: response.status, retryAfter, details: data}
      );
    }
  }

  esc(value) { return encodeURIComponent(value); }

  listBoards(args, signal) {
    return this.request("GET", "/v2/boards", {
      query: {
        team_id: args.teamId,
        project_id: args.projectId,
        query: args.query,
        owner: args.owner,
        limit: args.limit ?? 20,
        offset: args.offset ?? 0,
        sort: args.sort
      },
      signal
    });
  }

  getBoard(args, signal) {
    return this.request("GET", `/v2/boards/${this.esc(args.boardId)}`, {signal});
  }

  createBoard(args, signal) {
    return this.request("POST", "/v2/boards", {
      body: {
        name: args.name,
        ...(args.description !== undefined ? {description: args.description} : {}),
        ...(args.teamId ? {teamId: args.teamId} : {}),
        ...(args.projectId ? {projectId: args.projectId} : {}),
        policy: {
          sharingPolicy: {
            access: "private",
            organizationAccess: "private",
            teamAccess: "private"
          }
        }
      },
      signal,
      retrySafe: false
    });
  }

  listItems(args, signal) {
    return this.request("GET", `/v2/boards/${this.esc(args.boardId)}/items`, {
      query: {limit: args.limit ?? 20, cursor: args.cursor, type: args.type},
      signal
    });
  }

  getItem(args, signal) {
    return this.request("GET", `/v2/boards/${this.esc(args.boardId)}/items/${this.esc(args.itemId)}`, {signal});
  }

  listMembers(args, signal) {
    return this.request("GET", `/v2/boards/${this.esc(args.boardId)}/members`, {
      query: {limit: args.limit ?? 20, cursor: args.cursor},
      signal
    });
  }

  itemPath(type, args) {
    const plural = {sticky_note: "sticky_notes", text: "texts", shape: "shapes"}[type];
    if (!plural) throw new Error(`Unsupported item type: ${type}`);
    return `/v2/boards/${this.esc(args.boardId)}/${plural}`;
  }

  createItem(type, args, signal) {
    const {boardId, approval_token, ...body} = args;
    return this.request("POST", this.itemPath(type, {boardId}), {body, signal, retrySafe: false});
  }

  updateItem(type, args, signal) {
    const {boardId, itemId, approval_token, ...body} = args;
    return this.request("PATCH", `${this.itemPath(type, {boardId})}/${this.esc(itemId)}`, {
      body, signal, retrySafe: false
    });
  }

  deleteItem(type, args, signal) {
    return this.request("DELETE", `${this.itemPath(type, args)}/${this.esc(args.itemId)}`, {
      signal, retrySafe: false
    });
  }
}
