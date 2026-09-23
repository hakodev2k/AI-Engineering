type Method = "GET" | "POST" | "PUT";
export class AirbrakeClient {
  constructor(private fetchImpl: typeof fetch = fetch) {}
  async request(path: string, method: Method = "GET", query: Record<string,string|number|boolean|undefined> = {}, body?: unknown, projectKey = false) {
    if (!path.startsWith("/") || path.includes("..")) throw new Error("Invalid Airbrake API path");
    const key = projectKey ? process.env.AIRBRAKE_PROJECT_KEY : process.env.AIRBRAKE_USER_KEY;
    if (!key) throw new Error(projectKey ? "AIRBRAKE_PROJECT_KEY is required" : "AIRBRAKE_USER_KEY is required");
    const url = new URL(`https://api.airbrake.io/api/v4${path}`);
    url.searchParams.set("key", key);
    for (const [k,v] of Object.entries(query)) if (v !== undefined) url.searchParams.set(k, String(v));
    const controller = new AbortController();
    const timeout = Math.min(Math.max(Number(process.env.AIRBRAKE_REQUEST_TIMEOUT_MS ?? 10000), 1000), 30000);
    const timer = setTimeout(() => controller.abort(), timeout);
    const attempts = method === "GET" ? 3 : 1;
    try {
      for (let attempt=0; attempt<attempts; attempt++) {
        const r = await this.fetchImpl(url, { method, headers: body === undefined ? undefined : { "content-type": "application/json" }, body: body === undefined ? undefined : JSON.stringify(body), signal: controller.signal });
        if (r.ok) return r.status === 204 ? { ok: true } : await r.json();
        if ([400,401,403,404,422].includes(r.status)) throw new Error(`Airbrake ${r.status}: ${await r.text()}`);
        if ((r.status === 429 || r.status >= 500) && attempt + 1 < attempts) {
          const retry = Number(r.headers.get("retry-after") ?? 0);
          await new Promise(resolve => setTimeout(resolve, retry > 0 ? Math.min(retry*1000,5000) : 250 * 2 ** attempt));
          continue;
        }
        throw new Error(`Airbrake ${r.status}: ${await r.text()}`);
      }
      throw new Error("Airbrake retry budget exhausted");
    } finally { clearTimeout(timer); }
  }
}
