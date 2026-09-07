import type { Config } from "./config.js";

export class WooCommerceApiError extends Error {
  constructor(public status: number, message: string, public retryAfter?: string) { super(message); }
}

export class WooCommerceClient {
  constructor(private config: Config, private fetchImpl: typeof fetch = fetch) {}

  async request(method: string, path: string, body?: unknown, query?: Record<string, string | number | boolean | undefined>) {
    const url = new URL(`${this.config.baseUrl}/wp-json/wc/v3${path}`);
    for (const [key, value] of Object.entries(query ?? {})) if (value !== undefined) url.searchParams.set(key, String(value));
    const auth = Buffer.from(`${this.config.consumerKey}:${this.config.consumerSecret}`).toString("base64");
    let lastError: unknown;
    const retryableMethod = method === "GET";
    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const response = await this.fetchImpl(url, {
          method,
          headers: { "Authorization": `Basic ${auth}`, "Content-Type": "application/json", "Accept": "application/json" },
          body: body === undefined ? undefined : JSON.stringify(body),
          signal: controller.signal
        });
        const text = await response.text();
        let payload: unknown = text;
        try { payload = text ? JSON.parse(text) : null; } catch {}
        if (response.ok) return { data: payload, source: "untrusted_provider_data" };
        const retryAfter = response.headers.get("retry-after") ?? undefined;
        if ((response.status === 429 || response.status >= 500) && retryableMethod && attempt < this.config.maxRetries) {
          const waitMs = retryAfter && /^\d+$/.test(retryAfter) ? Number(retryAfter) * 1000 : Math.min(250 * 2 ** attempt, 4000);
          await new Promise(resolve => setTimeout(resolve, waitMs));
          continue;
        }
        const message = typeof payload === "object" && payload && "message" in payload ? String((payload as any).message) : `WooCommerce API error ${response.status}`;
        throw new WooCommerceApiError(response.status, message, retryAfter);
      } catch (error) {
        lastError = error;
        if (error instanceof WooCommerceApiError) throw error;
        if (!retryableMethod || attempt >= this.config.maxRetries) {
          if ((error as Error)?.name === "AbortError") throw new Error("WooCommerce request timed out.");
          throw new Error(`WooCommerce network request failed: ${(error as Error)?.message ?? String(error)}`);
        }
        await new Promise(resolve => setTimeout(resolve, Math.min(250 * 2 ** attempt, 4000)));
      } finally { clearTimeout(timer); }
    }
    throw lastError;
  }
}
