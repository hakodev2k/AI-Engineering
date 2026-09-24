import { accessToken } from "./security.js";

export class CalendlyError extends Error {
  constructor(public status: number, message: string, public retryAfter?: number) { super(message); }
}

export class CalendlyClient {
  constructor(private fetchFn: typeof fetch = fetch, private env = process.env) {}
  private base() { return (this.env.CALENDLY_API_BASE_URL || "https://api.calendly.com").replace(/\/$/, ""); }
  async request(path: string, init: RequestInit = {}, retryable = true): Promise<any> {
    const max = Number(this.env.CALENDLY_MAX_RETRIES || 2);
    const timeout = Number(this.env.CALENDLY_TIMEOUT_MS || 10000);
    for (let attempt = 0; ; attempt++) {
      const ctl = new AbortController(); const timer = setTimeout(() => ctl.abort(), timeout);
      try {
        const res = await this.fetchFn(`${this.base()}${path}`, { ...init, signal: ctl.signal, headers: { Authorization: `Bearer ${accessToken(this.env)}`, "Content-Type": "application/json", ...(init.headers || {}) } });
        const text = await res.text(); const data = text ? JSON.parse(text) : {};
        if (res.ok) return data;
        const reset = Number(res.headers.get("x-ratelimit-reset") || 0);
        const transient = res.status === 429 || res.status >= 500;
        if (retryable && transient && attempt < max) { await new Promise(r => setTimeout(r, Math.min(5000, (reset || 2 ** attempt) * 1000))); continue; }
        throw new CalendlyError(res.status, data?.message || data?.title || `Calendly HTTP ${res.status}`, reset || undefined);
      } catch (e: any) {
        if (e?.name === "AbortError") throw new Error("CALENDLY_TIMEOUT");
        throw e;
      } finally { clearTimeout(timer); }
    }
  }
  get(path: string) { return this.request(path); }
  post(path: string, body: unknown, retryable = false) { return this.request(path, { method: "POST", body: JSON.stringify(body) }, retryable); }
}

export function qs(params: Record<string, string | number | undefined>) {
  const s = new URLSearchParams(); Object.entries(params).forEach(([k,v]) => { if (v !== undefined) s.set(k, String(v)); });
  const q = s.toString(); return q ? `?${q}` : "";
}
