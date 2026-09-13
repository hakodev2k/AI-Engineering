import type { CopperConfig } from "./config.js";

export class CopperError extends Error {
  constructor(public status: number, message: string, public retryAfter?: number) {
    super(message);
    this.name = "CopperError";
  }
}

export class CopperClient {
  constructor(private readonly config: CopperConfig, private readonly fetchImpl: typeof fetch = fetch) {}

  private headers(): Record<string, string> {
    return {
      "Content-Type": "application/json",
      "X-PW-AccessToken": this.config.apiKey,
      "X-PW-Application": "developer_api",
      "X-PW-UserEmail": this.config.userEmail
    };
  }

  private async request(method: string, path: string, body?: unknown, retryable = true): Promise<unknown> {
    const url = new URL(`${this.config.baseUrl}/${path.replace(/^\/+/, "")}`);
    if (url.hostname !== "api.copper.com" || url.protocol !== "https:") throw new Error("Unsafe Copper API destination");

    let lastError: unknown;
    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const response = await this.fetchImpl(url, {
          method,
          headers: this.headers(),
          body: body === undefined ? undefined : JSON.stringify(body),
          signal: controller.signal
        });
        clearTimeout(timer);

        const text = await response.text();
        const payload = text ? (() => { try { return JSON.parse(text); } catch { return text; } })() : null;
        if (response.ok) return payload;

        const retryAfterHeader = response.headers.get("retry-after");
        const retryAfter = retryAfterHeader ? Number.parseInt(retryAfterHeader, 10) : undefined;
        const message = typeof payload === "string" ? payload.slice(0, 1000) : JSON.stringify(payload).slice(0, 1000);
        const error = new CopperError(response.status, `Copper API ${response.status}: ${message}`, retryAfter);

        if (!retryable || ![429, 500, 502, 503, 504].includes(response.status) || attempt === this.config.maxRetries) throw error;
        const delay = Number.isFinite(retryAfter) ? Math.min((retryAfter as number) * 1000, 30_000) : Math.min(250 * 2 ** attempt, 4_000);
        await new Promise(resolve => setTimeout(resolve, delay));
      } catch (error) {
        clearTimeout(timer);
        lastError = error;
        if (error instanceof CopperError) throw error;
        if (!retryable || attempt === this.config.maxRetries) throw error;
        await new Promise(resolve => setTimeout(resolve, Math.min(250 * 2 ** attempt, 4_000)));
      }
    }
    throw lastError instanceof Error ? lastError : new Error("Copper request failed");
  }

  get(path: string): Promise<unknown> { return this.request("GET", path); }
  post(path: string, body: unknown, retryable = true): Promise<unknown> { return this.request("POST", path, body, retryable); }
  put(path: string, body: unknown): Promise<unknown> { return this.request("PUT", path, body, false); }
}
