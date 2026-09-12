import type { Config } from './config.js';

export class PortTokenProvider {
  private mcp?: { token: string; expiresAt: number };
  private api?: { token: string; expiresAt: number };
  constructor(private readonly cfg: Config, private readonly fetchFn: typeof fetch = fetch) {}

  private valid(v?: { token: string; expiresAt: number }): string | undefined {
    return v && Date.now() + 60_000 < v.expiresAt ? v.token : undefined;
  }

  async mcpToken(): Promise<string> {
    const cached = this.valid(this.mcp); if (cached) return cached;
    const body = new URLSearchParams({ grant_type: 'client_credentials', client_id: this.cfg.clientId, client_secret: this.cfg.clientSecret });
    const r = await this.fetchFn(`${this.cfg.mcpUrl}/token`, { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body });
    if (!r.ok) throw new Error(`Port MCP authentication failed (${r.status})`);
    const data = await r.json() as { access_token: string; expires_in?: number };
    this.mcp = { token: data.access_token, expiresAt: Date.now() + (data.expires_in ?? 10800) * 1000 };
    return this.mcp.token;
  }

  async apiToken(): Promise<string> {
    const cached = this.valid(this.api); if (cached) return cached;
    const r = await this.fetchFn(`${this.cfg.apiUrl}/auth/access_token`, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ clientId: this.cfg.clientId, clientSecret: this.cfg.clientSecret })
    });
    if (!r.ok) throw new Error(`Port API authentication failed (${r.status})`);
    const data = await r.json() as { accessToken: string; expiresIn?: number };
    this.api = { token: data.accessToken, expiresAt: Date.now() + (data.expiresIn ?? 10800) * 1000 };
    return this.api.token;
  }

  invalidate(): void { this.mcp = undefined; this.api = undefined; }
}
