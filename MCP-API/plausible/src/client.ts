import type { Config } from "./config.js";

export class PlausibleApiError extends Error {
  constructor(public status: number, message: string, public retryAfter?: string) {
    super(message);
    this.name = "PlausibleApiError";
  }
}

type AuthKind = "stats" | "sites" | "none";

export class PlausibleClient {
  constructor(private cfg: Config, private http: typeof fetch = fetch) {}

  async request(method: string, path: string, auth: AuthKind, body?: unknown, query?: Record<string, string | undefined>, extraHeaders?: Record<string, string>) {
    const url = new URL(this.cfg.baseUrl + path);
    for (const [k, v] of Object.entries(query ?? {})) if (v !== undefined) url.searchParams.set(k, v);
    const token = auth === "stats" ? this.cfg.statsApiKey : auth === "sites" ? this.cfg.sitesApiKey : "";
    if (auth !== "none" && !token) throw new Error(`Missing ${auth} API key.`);
    const safeRetry = method === "GET" || (method === "POST" && path === "/api/v2/query");
    let attempt = 0;
    while (true) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.cfg.timeoutMs);
      try {
        const response = await this.http(url, {
          method,
          signal: controller.signal,
          headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(body === undefined ? {} : { "Content-Type": "application/json" }),
            ...(extraHeaders ?? {})
          },
          body: body === undefined ? undefined : JSON.stringify(body)
        });
        const text = await response.text();
        let data: unknown = text;
        if (text) { try { data = JSON.parse(text); } catch {} }
        if (response.ok) return {
          data,
          meta: {
            retryAfter: response.headers.get("retry-after"),
            dropped: response.headers.get("x-plausible-dropped") === "1"
          }
        };
        if (safeRetry && (response.status === 429 || response.status >= 500) && attempt < this.cfg.maxRetries) {
          const h = response.headers.get("retry-after");
          const delay = h && /^\d+$/.test(h) ? Number(h) * 1000 : Math.min(250 * (2 ** attempt), 2000);
          attempt++;
          await new Promise(r => setTimeout(r, delay));
          continue;
        }
        throw new PlausibleApiError(response.status, typeof data === "string" ? data : JSON.stringify(data), response.headers.get("retry-after") ?? undefined);
      } catch (error) {
        if (safeRetry && !(error instanceof PlausibleApiError) && attempt < this.cfg.maxRetries) {
          attempt++;
          await new Promise(r => setTimeout(r, Math.min(250 * (2 ** (attempt - 1)), 2000)));
          continue;
        }
        throw error;
      } finally {
        clearTimeout(timer);
      }
    }
  }
}
