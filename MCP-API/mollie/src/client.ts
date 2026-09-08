import type { CredentialProvider } from "./auth.js";

export class MollieError extends Error {
  constructor(public readonly status: number, message: string, public readonly retryAfter?: number) { super(message); }
}

export class MollieClient {
  constructor(
    private readonly credentials: CredentialProvider,
    private readonly baseUrl = process.env.MOLLIE_API_BASE_URL ?? "https://api.mollie.com/v2",
    private readonly timeoutMs = Number(process.env.MOLLIE_TIMEOUT_MS ?? 15000),
    private readonly maxRetries = Number(process.env.MOLLIE_MAX_RETRIES ?? 3),
    private readonly fetcher: typeof fetch = fetch,
  ) {
    const u = new URL(baseUrl);
    if (u.protocol !== "https:" || u.username || u.password) throw new Error("Mollie base URL must be HTTPS without embedded credentials");
  }

  async request(method: string, path: string, body?: unknown, query?: Record<string, string | number | boolean | undefined>): Promise<any> {
    if (!path.startsWith("/") || path.includes("..")) throw new Error("Invalid API path");
    const url = new URL(this.baseUrl.replace(/\/$/, "") + path);
    for (const [k, v] of Object.entries(query ?? {})) if (v !== undefined) url.searchParams.set(k, String(v));
    const token = await this.credentials.getAccessToken();
    const retryable = method === "GET";
    for (let attempt = 0; ; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeoutMs);
      try {
        const res = await this.fetcher(url, {
          method,
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", Accept: "application/hal+json" },
          body: body === undefined ? undefined : JSON.stringify(body),
          signal: controller.signal,
        });
        const text = await res.text();
        const data = text ? JSON.parse(text) : null;
        if (res.ok) return data;
        const retryAfter = Number(res.headers.get("retry-after") ?? 0) || undefined;
        if (retryable && (res.status === 429 || res.status >= 500) && attempt < this.maxRetries) {
          const wait = retryAfter ? retryAfter * 1000 : Math.min(250 * 2 ** attempt, 4000);
          await new Promise(r => setTimeout(r, wait));
          continue;
        }
        throw new MollieError(res.status, data?.detail ?? data?.title ?? `Mollie API ${res.status}`, retryAfter);
      } catch (e) {
        if (e instanceof MollieError) throw e;
        if (attempt < this.maxRetries && retryable && !(e instanceof DOMException && e.name === "AbortError")) {
          await new Promise(r => setTimeout(r, Math.min(250 * 2 ** attempt, 4000)));
          continue;
        }
        if (e instanceof DOMException && e.name === "AbortError") throw new Error(`Mollie request timed out after ${this.timeoutMs}ms`);
        throw e;
      } finally { clearTimeout(timer); }
    }
  }
}
