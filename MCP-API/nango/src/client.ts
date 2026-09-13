import type { Config } from "./config.js";

export class NangoError extends Error {
  constructor(message: string, public readonly status?: number, public readonly retryAfterSeconds?: number) { super(message); }
}

type RequestOptions = { method?: "GET" | "POST"; body?: unknown; headers?: Record<string, string>; retrySafe?: boolean };

export class NangoClient {
  constructor(private readonly config: Config, private readonly fetchImpl: typeof fetch = fetch) {}

  async request(path: string, options: RequestOptions = {}): Promise<unknown> {
    if (!path.startsWith("/")) throw new Error("path must be absolute");
    const method = options.method || "GET";
    let attempt = 0;
    for (;;) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const response = await this.fetchImpl(`${this.config.baseUrl}${path}`, {
          method,
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${this.config.secretKey}`,
            Accept: "application/json",
            ...(options.body === undefined ? {} : { "Content-Type": "application/json" }),
            ...options.headers
          },
          body: options.body === undefined ? undefined : JSON.stringify(options.body)
        });
        const text = await response.text();
        const parsed = text ? safeJson(text) : null;
        if (response.ok) return parsed;
        const retryAfter = parseRetryAfter(response.headers.get("retry-after"));
        const canRetry = (method === "GET" || options.retrySafe) && [429, 502, 503, 504].includes(response.status) && attempt < this.config.maxRetries;
        if (canRetry) {
          await sleep(retryAfter != null ? retryAfter * 1000 : Math.min(4000, 250 * 2 ** attempt));
          attempt++;
          continue;
        }
        throw new NangoError(`Nango API ${response.status}: ${redact(String(text).slice(0, 1200), this.config.secretKey)}`, response.status, retryAfter);
      } catch (error) {
        if (error instanceof NangoError) throw error;
        if (error instanceof Error && error.name === "AbortError") throw new NangoError("Nango API request timed out");
        throw new NangoError(`Nango API network error: ${error instanceof Error ? error.message : String(error)}`);
      } finally { clearTimeout(timer); }
    }
  }

  listProviders(): Promise<unknown> { return this.request("/providers"); }
  getProvider(provider: string): Promise<unknown> { return this.request(`/providers/${encodeURIComponent(provider)}`); }
  listIntegrations(): Promise<unknown> { return this.request("/integrations"); }
  createConnectSession(body: unknown): Promise<unknown> { return this.request("/connect/sessions", { method: "POST", body }); }
  mcp(integrationId: string, connectionId: string, body: unknown): Promise<unknown> {
    return this.request("/mcp", { method: "POST", body, headers: { "Provider-Config-Key": integrationId, "Connection-Id": connectionId } });
  }
}

function safeJson(text: string): unknown { try { return JSON.parse(text); } catch { return { raw: text }; } }
function redact(text: string, secret: string): string { return secret ? text.split(secret).join("[REDACTED]") : text; }
function parseRetryAfter(value: string | null): number | undefined {
  if (!value) return undefined;
  const seconds = Number(value);
  return Number.isFinite(seconds) && seconds >= 0 ? seconds : undefined;
}
function sleep(ms: number): Promise<void> { return new Promise(resolve => setTimeout(resolve, ms)); }
