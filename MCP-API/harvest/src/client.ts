import type { HarvestConfig } from "./config.js";

export class HarvestApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly retryAfter?: string,
    public readonly body?: unknown
  ) {
    super(message);
    this.name = "HarvestApiError";
  }
}

export type HarvestFetch = typeof fetch;

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function retryDelay(attempt: number, retryAfter?: string): number {
  if (retryAfter) {
    const seconds = Number(retryAfter);
    if (Number.isFinite(seconds) && seconds >= 0) return Math.min(seconds * 1000, 60000);
  }
  return Math.min(500 * 2 ** attempt, 8000);
}

export class HarvestClient {
  private readonly baseUrl = "https://api.harvestapp.com/v2";

  constructor(private readonly config: HarvestConfig, private readonly fetchImpl: HarvestFetch = fetch) {}

  async request(method: "GET" | "POST" | "PATCH", path: string, body?: unknown, query?: Record<string, string | number | boolean | undefined>): Promise<unknown> {
    if (!path.startsWith("/") || path.includes("//")) throw new Error("Invalid Harvest API path.");
    const url = new URL(this.baseUrl + path);
    for (const [key, value] of Object.entries(query ?? {})) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }

    const maxAttempts = method === "GET" ? this.config.maxRetries + 1 : 1;
    let lastError: unknown;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const response = await this.fetchImpl(url, {
          method,
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${this.config.accessToken}`,
            "Harvest-Account-Id": this.config.accountId,
            "User-Agent": this.config.userAgent,
            Accept: "application/json",
            ...(body === undefined ? {} : { "Content-Type": "application/json" })
          },
          body: body === undefined ? undefined : JSON.stringify(body)
        });
        clearTimeout(timer);

        const text = await response.text();
        let parsed: unknown = undefined;
        if (text) {
          try { parsed = JSON.parse(text); } catch { parsed = text; }
        }
        if (response.ok) return parsed;

        const retryAfter = response.headers.get("retry-after") ?? undefined;
        const err = new HarvestApiError(response.status, `Harvest API returned HTTP ${response.status}.`, retryAfter, parsed);
        if (method === "GET" && attempt + 1 < maxAttempts && (response.status === 429 || response.status >= 500)) {
          await sleep(retryDelay(attempt, retryAfter));
          continue;
        }
        throw err;
      } catch (error) {
        clearTimeout(timer);
        if (error instanceof HarvestApiError) throw error;
        lastError = error;
        const retryable = method === "GET" && attempt + 1 < maxAttempts;
        if (!retryable) {
          if (error instanceof Error && error.name === "AbortError") throw new Error(`Harvest request timed out after ${this.config.timeoutMs}ms.`);
          throw error;
        }
        await sleep(retryDelay(attempt));
      }
    }
    throw lastError instanceof Error ? lastError : new Error("Harvest request failed.");
  }
}
