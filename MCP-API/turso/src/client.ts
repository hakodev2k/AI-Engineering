import type { Config } from "./config.js";

export class TursoApiError extends Error {
  constructor(public status: number, message: string, public retryAfter?: string) {
    super(message);
    this.name = "TursoApiError";
  }
}

export class TursoClient {
  constructor(private readonly config: Config) {}

  async request<T>(method: "GET" | "POST", path: string, body?: unknown, query?: Record<string, string | undefined>): Promise<T> {
    const url = new URL(`${this.config.baseUrl}${path}`);
    for (const [key, value] of Object.entries(query ?? {})) if (value !== undefined) url.searchParams.set(key, value);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
    try {
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${this.config.token}`,
          Accept: "application/json",
          ...(body === undefined ? {} : { "Content-Type": "application/json" })
        },
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: controller.signal
      });
      const text = await response.text();
      const parsed = text ? safeJson(text) : null;
      if (!response.ok) {
        const message = typeof parsed === "object" && parsed && "error" in parsed
          ? String((parsed as { error: unknown }).error)
          : `Turso API request failed with HTTP ${response.status}`;
        throw new TursoApiError(response.status, message, response.headers.get("retry-after") ?? undefined);
      }
      return parsed as T;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") throw new Error(`Turso API request timed out after ${this.config.timeoutMs}ms`);
      throw error;
    } finally {
      clearTimeout(timer);
    }
  }
}

function safeJson(text: string): unknown {
  try { return JSON.parse(text); }
  catch { return { raw: text }; }
}
