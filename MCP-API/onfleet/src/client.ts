import type { Config } from "./config.js";

export class OnfleetError extends Error {
  constructor(public status: number, message: string, public body?: unknown) {
    super(message);
  }
}

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => { clearTimeout(timer); reject(signal.reason ?? new Error("Aborted")); }, { once: true });
  });
}

export class OnfleetClient {
  constructor(private readonly config: Config, private readonly fetchImpl: typeof fetch = fetch) {}

  async request(method: string, path: string, options: { query?: Record<string, string | number | boolean | undefined>; body?: unknown; signal?: AbortSignal; retryable?: boolean } = {}): Promise<unknown> {
    if (!path.startsWith("/")) throw new Error("path must start with /");
    const url = new URL(this.config.baseUrl + path);
    for (const [key, value] of Object.entries(options.query ?? {})) if (value !== undefined) url.searchParams.set(key, String(value));
    const auth = Buffer.from(`${this.config.apiKey}:`, "utf8").toString("base64");
    const retryable = options.retryable ?? method === "GET";

    for (let attempt = 0; ; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(new Error("Onfleet request timed out")), this.config.timeoutMs);
      const forwardAbort = () => controller.abort(options.signal?.reason);
      options.signal?.addEventListener("abort", forwardAbort, { once: true });
      try {
        const response = await this.fetchImpl(url, {
          method,
          headers: {
            Authorization: `Basic ${auth}`,
            Accept: "application/json",
            ...(options.body === undefined ? {} : { "Content-Type": "application/json" })
          },
          body: options.body === undefined ? undefined : JSON.stringify(options.body),
          signal: controller.signal
        });
        const text = await response.text();
        const payload = text ? (() => { try { return JSON.parse(text); } catch { return text; } })() : null;
        if (response.ok) return payload;

        const retryAfter = Number(response.headers.get("retry-after") ?? "0");
        const transient = response.status === 429 || response.status === 502 || response.status === 503 || response.status === 504;
        if (retryable && transient && attempt < this.config.maxRetries) {
          const waitMs = retryAfter > 0 ? retryAfter * 1000 : Math.min(500 * 2 ** attempt, 8000);
          await sleep(waitMs + Math.floor(Math.random() * 200), options.signal);
          continue;
        }
        throw new OnfleetError(response.status, `Onfleet API returned HTTP ${response.status}`, payload);
      } finally {
        clearTimeout(timer);
        options.signal?.removeEventListener("abort", forwardAbort);
      }
    }
  }
}
