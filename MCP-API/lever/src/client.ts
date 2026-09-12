import type { Config } from "./config.js";

export class LeverError extends Error {
  constructor(message: string, public status?: number, public retryAfter?: number) { super(message); }
}

export class LeverClient {
  constructor(private readonly config: Config, private readonly fetcher: typeof fetch = fetch) {}

  private auth(): string { return `Basic ${Buffer.from(`${this.config.apiKey}:`).toString("base64")}`; }

  async request(method: string, path: string, query?: Record<string, unknown>, body?: unknown, retryable = true): Promise<unknown> {
    const url = new URL(`${this.config.baseUrl}${path}`);
    for (const [key, value] of Object.entries(query ?? {})) {
      if (value !== undefined && value !== null && value !== "") url.searchParams.append(key, String(value));
    }
    for (let attempt = 0; ; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const response = await this.fetcher(url, {
          method,
          headers: { Authorization: this.auth(), Accept: "application/json", ...(body === undefined ? {} : { "Content-Type": "application/json" }) },
          body: body === undefined ? undefined : JSON.stringify(body),
          signal: controller.signal
        });
        const retryAfter = Number(response.headers.get("retry-after") ?? 0) || undefined;
        if (!response.ok) {
          const text = (await response.text()).slice(0, 4000);
          if (retryable && attempt < this.config.maxRetries && (response.status === 429 || response.status >= 500)) {
            await new Promise(r => setTimeout(r, Math.min((retryAfter ?? 2 ** attempt) * 1000, 10000)));
            continue;
          }
          throw new LeverError(`Lever API ${response.status}: ${text || response.statusText}`, response.status, retryAfter);
        }
        if (response.status === 204) return null;
        return await response.json();
      } catch (error) {
        if (error instanceof LeverError) throw error;
        if (attempt < this.config.maxRetries && retryable) { await new Promise(r => setTimeout(r, Math.min(250 * 2 ** attempt, 2000))); continue; }
        if (error instanceof Error && error.name === "AbortError") throw new LeverError("Lever request timed out");
        throw error;
      } finally { clearTimeout(timer); }
    }
  }
}
