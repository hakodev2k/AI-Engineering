import type { Config } from "./config.js";

const BASE = "https://api.pushover.net/1";

export class PushoverClient {
  constructor(private readonly config: Config, private readonly fetcher: typeof fetch = fetch) {}

  private async request(path: string, method: "GET" | "POST", params: Record<string, string | number | boolean | undefined>, retryable = method === "GET"): Promise<unknown> {
    const body = new URLSearchParams();
    body.set("token", this.config.token);
    for (const [key, value] of Object.entries(params)) if (value !== undefined) body.set(key, String(value));
    const url = method === "GET" ? `${BASE}${path}?${body.toString()}` : `${BASE}${path}`;
    let last: unknown;
    for (let attempt = 0; attempt <= (retryable ? this.config.maxRetries : 0); attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const response = await this.fetcher(url, {
          method,
          headers: method === "POST" ? { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "daily-mcp-pushover/1.0" } : { "User-Agent": "daily-mcp-pushover/1.0" },
          body: method === "POST" ? body : undefined,
          signal: controller.signal
        });
        const text = await response.text();
        let data: any;
        try { data = text ? JSON.parse(text) : {}; } catch { throw new Error(`Pushover returned non-JSON response (${response.status})`); }
        if (response.ok && data.status === 1) return data;
        const message = Array.isArray(data.errors) ? data.errors.join("; ") : `Pushover API error ${response.status}`;
        if (response.status >= 500 && retryable && attempt < this.config.maxRetries) {
          await new Promise((r) => setTimeout(r, Math.max(5000, 5000 * 2 ** attempt)));
          continue;
        }
        if (response.status === 429) throw new Error(`RATE_LIMIT: ${message}`);
        if (response.status === 401 || response.status === 403) throw new Error(`AUTHORIZATION: ${message}`);
        throw new Error(message);
      } catch (error) {
        last = error;
        if (error instanceof Error && error.name === "AbortError") throw new Error("TIMEOUT: Pushover request timed out");
        if (!retryable || attempt >= this.config.maxRetries || (error instanceof Error && /RATE_LIMIT|AUTHORIZATION/.test(error.message))) throw error;
        await new Promise((r) => setTimeout(r, 5000 * 2 ** attempt));
      } finally { clearTimeout(timer); }
    }
    throw last instanceof Error ? last : new Error("Pushover request failed");
  }

  validate(user: string, device?: string) { return this.request("/users/validate.json", "POST", { user, device }, false); }
  limits() { return this.request("/apps/limits.json", "GET", {}); }
  sounds() { return this.request("/sounds.json", "GET", {}); }
  send(input: Record<string, string | number | boolean | undefined>) { return this.request("/messages.json", "POST", input, false); }
  glance(input: Record<string, string | number | boolean | undefined>) { return this.request("/glances.json", "POST", input, false); }
  receiptGet(receipt: string) { return this.request(`/receipts/${encodeURIComponent(receipt)}.json`, "GET", {}); }
  receiptCancel(receipt: string) { return this.request(`/receipts/${encodeURIComponent(receipt)}/cancel.json`, "POST", {}, false); }
  receiptCancelByTag(tag: string) { return this.request(`/receipts/cancel_by_tag/${encodeURIComponent(tag)}.json`, "POST", {}, false); }
  groups() { return this.request("/groups.json", "GET", {}); }
  groupGet(group: string) { return this.request(`/groups/${encodeURIComponent(group)}.json`, "GET", {}); }
  groupCreate(name: string) { return this.request("/groups.json", "POST", { name }, false); }
  groupAction(group: string, action: "add_user" | "remove_user" | "disable_user" | "enable_user", user: string, device?: string, memo?: string) {
    return this.request(`/groups/${encodeURIComponent(group)}/${action}.json`, "POST", { user, device, memo }, false);
  }
  groupRename(group: string, name: string) { return this.request(`/groups/${encodeURIComponent(group)}/rename.json`, "POST", { name }, false); }
}
