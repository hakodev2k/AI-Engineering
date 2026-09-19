export class SingleStoreError extends Error {
  constructor(public status: number, message: string, public retryAfterMs?: number) { super(message); }
}

export interface ClientOptions { apiKey: string; baseUrl?: string; timeoutMs?: number; fetchImpl?: typeof fetch; }

export class SingleStoreClient {
  private readonly baseUrl: string;
  private readonly timeoutMs: number;
  private readonly f: typeof fetch;
  constructor(private readonly options: ClientOptions) {
    if (!options.apiKey?.trim()) throw new Error("SINGLESTORE_API_KEY is required");
    this.baseUrl = options.baseUrl ?? "https://api.singlestore.com";
    if (!this.baseUrl.startsWith("https://")) throw new Error("SingleStore API base URL must use HTTPS");
    this.timeoutMs = options.timeoutMs ?? 15000;
    this.f = options.fetchImpl ?? fetch;
  }

  async request(path: string, init: RequestInit = {}, retry = true): Promise<unknown> {
    if (!path.startsWith("/") || path.includes("..") || /^\/\//.test(path)) throw new Error("Invalid API path");
    const method = (init.method ?? "GET").toUpperCase();
    const safeRetry = retry && ["GET", "HEAD"].includes(method);
    for (let attempt = 0; attempt < (safeRetry ? 3 : 1); attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeoutMs);
      try {
        const res = await this.f(new URL(path, this.baseUrl), {
          ...init,
          signal: controller.signal,
          headers: {"accept":"application/json","content-type":"application/json","authorization":`Bearer ${this.options.apiKey}`,...init.headers}
        });
        const retryAfter = Number(res.headers.get("retry-after") ?? "0") * 1000;
        if ((res.status === 429 || res.status >= 500) && safeRetry && attempt < 2) {
          await new Promise(r => setTimeout(r, retryAfter || Math.min(4000, 250 * 2 ** attempt)));
          continue;
        }
        const text = await res.text();
        const body = text ? JSON.parse(text) : null;
        if (!res.ok) throw new SingleStoreError(res.status, body?.message ?? body?.error ?? `SingleStore API error ${res.status}`, retryAfter || undefined);
        return body;
      } catch (e) {
        if (e instanceof SingleStoreError) throw e;
        if (e instanceof DOMException && e.name === "AbortError") throw new SingleStoreError(408, "SingleStore request timed out");
        if (!safeRetry || attempt === 2) throw e;
        await new Promise(r => setTimeout(r, Math.min(4000, 250 * 2 ** attempt)));
      } finally { clearTimeout(timer); }
    }
    throw new Error("Unreachable");
  }
}
