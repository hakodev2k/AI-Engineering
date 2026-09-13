import type { BrexConfig } from "./config.js";

export class BrexApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly traceId?: string,
    public readonly retryAfterSeconds?: number
  ) { super(message); }
}

export interface Page<T = unknown> { items: T[]; next_cursor?: string | null; }
export type FetchLike = typeof fetch;

export class BrexClient {
  constructor(private readonly config: BrexConfig, private readonly fetchImpl: FetchLike = fetch) {}

  private async request<T>(path: string, query: Record<string, string | number | undefined> = {}): Promise<T> {
    const url = new URL(path, this.config.apiBaseUrl);
    for (const [k, v] of Object.entries(query)) if (v !== undefined) url.searchParams.set(k, String(v));

    for (let attempt = 0; ; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      let response: Response;
      try {
        response = await this.fetchImpl(url, {
          method: "GET",
          headers: { authorization: `Bearer ${this.config.accessToken}`, accept: "application/json" },
          signal: controller.signal
        });
      } catch (error) {
        clearTimeout(timer);
        if (attempt < this.config.maxRetries && error instanceof TypeError) {
          await new Promise((r) => setTimeout(r, 100 * 2 ** attempt));
          continue;
        }
        if (error instanceof Error && error.name === "AbortError") throw new Error("Brex request timed out");
        throw error;
      } finally {
        clearTimeout(timer);
      }

      const traceId = response.headers.get("x-brex-trace-id") ?? undefined;
      const retryAfterRaw = response.headers.get("retry-after");
      const retryAfterSeconds = retryAfterRaw ? Number.parseInt(retryAfterRaw, 10) : undefined;

      if (response.ok) return await response.json() as T;

      const body = await response.text();
      const message = `Brex API ${response.status}: ${body.slice(0, 1000)}`;
      if ((response.status === 429 || response.status >= 500) && attempt < this.config.maxRetries) {
        const waitMs = Number.isFinite(retryAfterSeconds) ? Math.min(30_000, retryAfterSeconds! * 1000) : 100 * 2 ** attempt;
        await new Promise((r) => setTimeout(r, waitMs));
        continue;
      }
      throw new BrexApiError(message, response.status, traceId, retryAfterSeconds);
    }
  }

  private page<T>(path: string, input: { limit?: number; cursor?: string } = {}, extra: Record<string, string | number | undefined> = {}) {
    return this.request<Page<T>>(path, { limit: input.limit ?? this.config.defaultPageSize, cursor: input.cursor, ...extra });
  }

  listUsers(input: { limit?: number; cursor?: string; email?: string }) { return this.page("/v2/users", input, { email: input.email }); }
  getUser(id: string) { return this.request(`/v2/users/${encodeURIComponent(id)}`); }
  listCards(input: { limit?: number; cursor?: string; userId?: string }) { return this.page("/v2/cards", input, { user_id: input.userId }); }
  getCard(id: string) { return this.request(`/v2/cards/${encodeURIComponent(id)}`); }
  listDepartments(input: { limit?: number; cursor?: string; name?: string }) { return this.page("/v2/departments", input, { name: input.name }); }
  listLocations(input: { limit?: number; cursor?: string; name?: string }) { return this.page("/v2/locations", input, { name: input.name }); }
  listLegalEntities(input: { limit?: number; cursor?: string }) { return this.page("/v2/legal_entities", input); }
  getLegalEntity(id: string) { return this.request(`/v2/legal_entities/${encodeURIComponent(id)}`); }
  listTitles(input: { limit?: number; cursor?: string; name?: string }) { return this.page("/v2/titles", input, { name: input.name }); }
  getPrimaryCardAccount() { return this.request("/v2/accounts/card/primary"); }
  listCashAccounts(input: { limit?: number; cursor?: string }) { return this.page("/v2/accounts/cash", input); }
  listPrimaryCardTransactions(input: { limit?: number; cursor?: string; postedAtStart?: string; postedAtEnd?: string }) {
    return this.page("/v2/transactions/card/primary", input, { posted_at_start: input.postedAtStart, posted_at_end: input.postedAtEnd });
  }
  listCashTransactions(accountId: string, input: { limit?: number; cursor?: string; postedAtStart?: string; postedAtEnd?: string }) {
    return this.page(`/v2/transactions/cash/${encodeURIComponent(accountId)}`, input, { posted_at_start: input.postedAtStart, posted_at_end: input.postedAtEnd });
  }
  listVendors(input: { limit?: number; cursor?: string; name?: string }) { return this.page("/v1/vendors", input, { name: input.name }); }
  getVendor(id: string) { return this.request(`/v1/vendors/${encodeURIComponent(id)}`); }
}
