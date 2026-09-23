import { safeIndexName, safeObjectId } from "./security.js";

export class AlgoliaRestClient {
  constructor(private fetchImpl: typeof fetch = fetch) {}
  private config() {
    const appId = process.env.ALGOLIA_APP_ID;
    const apiKey = process.env.ALGOLIA_API_KEY;
    if (!appId || !apiKey) throw new Error("ALGOLIA_APP_ID and ALGOLIA_API_KEY are required for REST writes");
    if (!/^[A-Za-z0-9-]+$/.test(appId)) throw new Error("Invalid ALGOLIA_APP_ID");
    return { appId, apiKey };
  }
  async request(method: "POST", index: string, path: string, body: unknown) {
    const { appId, apiKey } = this.config();
    const controller = new AbortController();
    const timeout = Math.min(Math.max(Number(process.env.ALGOLIA_REQUEST_TIMEOUT_MS ?? 10000), 1000), 30000);
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
      const url = `https://${appId}.algolia.net/1/indexes/${encodeURIComponent(safeIndexName(index))}${path}`;
      for (let attempt = 0; attempt < 3; attempt++) {
        const response = await this.fetchImpl(url, { method, headers: { "x-algolia-application-id": appId, "x-algolia-api-key": apiKey, "content-type": "application/json" }, body: JSON.stringify(body), signal: controller.signal });
        if (response.ok) return await response.json();
        if (response.status === 401 || response.status === 403 || response.status === 400) throw new Error(`Algolia ${response.status}: ${await response.text()}`);
        if ((response.status === 429 || response.status >= 500) && attempt < 2) {
          const retryAfter = Number(response.headers.get("retry-after") ?? 0);
          await new Promise(r => setTimeout(r, retryAfter > 0 ? Math.min(retryAfter * 1000, 5000) : 250 * 2 ** attempt));
          continue;
        }
        throw new Error(`Algolia ${response.status}: ${await response.text()}`);
      }
      throw new Error("Algolia retry budget exhausted");
    } finally { clearTimeout(timer); }
  }
  create(index: string, object: Record<string, unknown>) { return this.request("POST", index, "", object); }
  partialUpdate(index: string, objectID: string, attributes: Record<string, unknown>) { return this.request("POST", index, `/${encodeURIComponent(safeObjectId(objectID))}/partial`, { ...attributes, objectID }); }
}
