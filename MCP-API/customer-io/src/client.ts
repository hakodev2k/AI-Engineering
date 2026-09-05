import type { Config } from "./config.js";

export class CustomerIoApiError extends Error {
  constructor(public status: number, message: string, public retryAfter?: string) {
    super(message);
    this.name = "CustomerIoApiError";
  }
}

export class CustomerIoClient {
  constructor(private config: Config, private fetcher: typeof fetch = fetch) {}

  async request(method: string, path: string, body?: unknown, query?: Record<string, string | undefined>) {
    const url = new URL(this.config.baseUrl + path);
    for (const [key, value] of Object.entries(query ?? {})) if (value !== undefined) url.searchParams.set(key, value);
    const safe = method === "GET";
    let attempt = 0;
    while (true) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const response = await this.fetcher(url, {
          method,
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${this.config.apiKey}`,
            Accept: "application/json",
            ...(this.config.workspaceId ? { "X-Workspace-Id": this.config.workspaceId } : {}),
            ...(body === undefined ? {} : { "Content-Type": "application/json" })
          },
          body: body === undefined ? undefined : JSON.stringify(body)
        });
        const text = await response.text();
        let data: unknown = text;
        if (text) { try { data = JSON.parse(text); } catch {} }
        if (response.ok) return { data, meta: { retryAfter: response.headers.get("retry-after") } };
        if (safe && (response.status === 429 || response.status >= 500) && attempt < this.config.maxRetries) {
          const retryAfter = response.headers.get("retry-after");
          const delay = retryAfter && /^\d+$/.test(retryAfter) ? Number(retryAfter) * 1000 : Math.min(250 * 2 ** attempt, 2000);
          attempt++;
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        throw new CustomerIoApiError(response.status, typeof data === "string" ? data : JSON.stringify(data), response.headers.get("retry-after") ?? undefined);
      } catch (error) {
        if (safe && !(error instanceof CustomerIoApiError) && attempt < this.config.maxRetries) {
          attempt++;
          await new Promise(resolve => setTimeout(resolve, Math.min(250 * 2 ** (attempt - 1), 2000)));
          continue;
        }
        throw error;
      } finally {
        clearTimeout(timer);
      }
    }
  }
}
