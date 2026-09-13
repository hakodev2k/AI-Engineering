import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import type { HibpConfig } from "./config.js";

export class HibpError extends Error {
  constructor(message: string, public readonly status?: number, public readonly retryAfterSeconds?: number) {
    super(message);
    this.name = "HibpError";
  }
}

type FetchLike = typeof fetch;

export class HibpClient {
  private mcpClient?: Client;
  private mcpTransport?: StreamableHTTPClientTransport;

  constructor(private readonly config: HibpConfig, private readonly fetchImpl: FetchLike = fetch) {}

  private async sleep(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }

  private headers(authenticated: boolean, extra?: Record<string, string>): HeadersInit {
    const headers: Record<string, string> = {
      accept: "application/json",
      "user-agent": this.config.userAgent,
      ...extra
    };
    if (authenticated) {
      if (!this.config.apiKey) throw new HibpError("HIBP_API_KEY is required for this protected operation", 401);
      headers["hibp-api-key"] = this.config.apiKey;
    }
    return headers;
  }

  private async request<T>(
    url: URL,
    options: { authenticated?: boolean; notFoundValue?: T; acceptText?: boolean; extraHeaders?: Record<string, string> } = {}
  ): Promise<T> {
    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const response = await this.fetchImpl(url, {
          method: "GET",
          headers: this.headers(Boolean(options.authenticated), {
            ...(options.acceptText ? { accept: "text/plain" } : {}),
            ...(options.extraHeaders ?? {})
          }),
          signal: controller.signal
        });
        if (response.status === 404 && options.notFoundValue !== undefined) return options.notFoundValue;
        if (response.ok) return (options.acceptText ? await response.text() : await response.json()) as T;

        const retryAfter = Number.parseInt(response.headers.get("retry-after") || "", 10);
        const retryable = response.status === 429 || response.status >= 500;
        if (retryable && attempt < this.config.maxRetries) {
          const waitMs = Number.isFinite(retryAfter) ? retryAfter * 1000 : 250 * 2 ** attempt;
          await this.sleep(Math.min(waitMs, 10_000));
          continue;
        }
        let detail = "";
        try { detail = await response.text(); } catch { detail = ""; }
        throw new HibpError(
          `HIBP request failed with HTTP ${response.status}${detail ? `: ${detail.slice(0, 300)}` : ""}`,
          response.status,
          Number.isFinite(retryAfter) ? retryAfter : undefined
        );
      } catch (error) {
        if (error instanceof HibpError) throw error;
        if (error instanceof Error && error.name === "AbortError") throw new HibpError("HIBP request timed out");
        if (attempt < this.config.maxRetries && error instanceof TypeError) {
          await this.sleep(250 * 2 ** attempt);
          continue;
        }
        throw new HibpError(error instanceof Error ? error.message : String(error));
      } finally {
        clearTimeout(timer);
      }
    }
    throw new HibpError("HIBP request failed after retries");
  }

  private async callOfficialMcp(tool: string, args: Record<string, unknown>): Promise<unknown> {
    if (!this.config.useOfficialMcp) throw new HibpError("Official MCP transport disabled");
    if (!this.mcpClient) {
      this.mcpClient = new Client({ name: "have-i-been-pwned-connector", version: "1.0.0" });
      this.mcpTransport = new StreamableHTTPClientTransport(new URL(this.config.mcpUrl));
      await this.mcpClient.connect(this.mcpTransport);
    }
    const result = await this.mcpClient.callTool({ name: tool, arguments: args });
    if (result.isError) throw new HibpError(`Official HIBP MCP tool ${tool} returned an error`);
    const structured = (result as { structuredContent?: unknown }).structuredContent;
    return structured !== undefined ? structured : result.content;
  }

  private async mcpFirst<T>(tool: string, args: Record<string, unknown>, fallback: () => Promise<T>): Promise<T> {
    try { return (await this.callOfficialMcp(tool, args)) as T; }
    catch { return fallback(); }
  }

  listBreaches(domain?: string, isSpamList?: boolean): Promise<unknown> {
    return this.mcpFirst("hibp_list_breaches", { domain, isSpamList }, async () => {
      const url = new URL(`${this.config.apiBaseUrl}/breaches`);
      if (domain) url.searchParams.set("domain", domain);
      if (isSpamList !== undefined) url.searchParams.set("isSpamList", String(isSpamList));
      return this.request(url);
    });
  }

  getBreach(name: string): Promise<unknown> {
    return this.mcpFirst("hibp_get_breach", { name }, () => this.request(new URL(`${this.config.apiBaseUrl}/breach/${encodeURIComponent(name)}`)));
  }

  latestBreach(): Promise<unknown> {
    return this.mcpFirst("hibp_get_latest_breach", {}, () => this.request(new URL(`${this.config.apiBaseUrl}/latestbreach`)));
  }

  listDataClasses(): Promise<unknown> {
    return this.mcpFirst("hibp_list_data_classes", {}, () => this.request(new URL(`${this.config.apiBaseUrl}/dataclasses`)));
  }

  pwnedPasswordRange(prefix: string, mode: "sha1" | "ntlm" = "sha1", padding = false): Promise<unknown> {
    return this.mcpFirst("hibp_get_pwned_passwords_range", { prefix, mode, padding }, async () => {
      const normalized = prefix.toUpperCase();
      const url = new URL(`/range/${normalized}`, this.config.passwordsBaseUrl);
      if (mode === "ntlm") url.searchParams.set("mode", "ntlm");
      const text = await this.request<string>(url, {
        acceptText: true,
        extraHeaders: padding ? { "Add-Padding": "true" } : undefined
      });
      return text.split(/\r?\n/).filter(Boolean).map((line) => {
        const [suffix, count] = line.split(":");
        return { suffix, count: Number.parseInt(count, 10) };
      });
    });
  }

  breachedAccount(email: string, includeUnverified = true, domain?: string): Promise<unknown> {
    const url = new URL(`${this.config.apiBaseUrl}/breachedaccount/${encodeURIComponent(email)}`);
    url.searchParams.set("truncateResponse", "false");
    url.searchParams.set("includeUnverified", String(includeUnverified));
    if (domain) url.searchParams.set("domain", domain);
    return this.request(url, { authenticated: true, notFoundValue: [] });
  }

  pasteAccount(email: string): Promise<unknown> {
    return this.request(new URL(`${this.config.apiBaseUrl}/pasteaccount/${encodeURIComponent(email)}`), { authenticated: true, notFoundValue: [] });
  }

  breachedDomain(domain: string): Promise<unknown> {
    return this.request(new URL(`${this.config.apiBaseUrl}/breacheddomain/${encodeURIComponent(domain)}`), { authenticated: true, notFoundValue: {} });
  }

  subscribedDomains(): Promise<unknown> {
    return this.request(new URL(`${this.config.apiBaseUrl}/subscribeddomains`), { authenticated: true });
  }

  subscriptionStatus(): Promise<unknown> {
    return this.request(new URL(`${this.config.apiBaseUrl}/subscription/status`), { authenticated: true });
  }

  async close(): Promise<void> {
    await this.mcpTransport?.close().catch(() => undefined);
    this.mcpClient = undefined;
    this.mcpTransport = undefined;
  }
}
