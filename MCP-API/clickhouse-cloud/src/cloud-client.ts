import type { Config } from "./config.js";

export class CloudError extends Error {
  constructor(public status: number, message: string, public retryAfter?: string) {
    super(message);
    this.name = "CloudError";
  }
}

export class ClickHouseCloudClient {
  constructor(private readonly cfg: Config, private readonly fetchFn: typeof fetch = fetch) {}

  private async get(path: string): Promise<unknown> {
    if (!path.startsWith("/v1/organizations/")) throw new Error("Refusing non-allowlisted ClickHouse Cloud path");
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.cfg.cloudTimeoutMs);
    try {
      const auth = Buffer.from(`${this.cfg.apiKey}:${this.cfg.apiSecret}`, "utf8").toString("base64");
      const res = await this.fetchFn(`https://api.clickhouse.cloud${path}`, {
        method: "GET",
        headers: { Authorization: `Basic ${auth}`, Accept: "application/json" },
        signal: controller.signal
      });
      if (!res.ok) {
        const body = await res.text();
        const safe = body.slice(0, 1000).replaceAll(this.cfg.apiKey, "[REDACTED]").replaceAll(this.cfg.apiSecret, "[REDACTED]");
        throw new CloudError(res.status, safe || `ClickHouse Cloud HTTP ${res.status}`, res.headers.get("retry-after") ?? undefined);
      }
      return await res.json();
    } catch (error) {
      if (error instanceof CloudError) throw error;
      if (error instanceof Error && error.name === "AbortError") throw new Error(`ClickHouse Cloud request timed out after ${this.cfg.cloudTimeoutMs}ms`);
      throw error;
    } finally {
      clearTimeout(timer);
    }
  }

  services() { return this.get(`/v1/organizations/${this.cfg.orgId}/services`); }
  service(serviceId: string) { return this.get(`/v1/organizations/${this.cfg.orgId}/services/${id(serviceId)}`); }
  clickpipes(serviceId: string) { return this.get(`/v1/organizations/${this.cfg.orgId}/services/${id(serviceId)}/clickpipes`); }
  clickpipe(serviceId: string, clickpipeId: string) { return this.get(`/v1/organizations/${this.cfg.orgId}/services/${id(serviceId)}/clickpipes/${id(clickpipeId)}`); }
  backups(serviceId: string) { return this.get(`/v1/organizations/${this.cfg.orgId}/services/${id(serviceId)}/backups`); }
  backup(serviceId: string, backupId: string) { return this.get(`/v1/organizations/${this.cfg.orgId}/services/${id(serviceId)}/backups/${id(backupId)}`); }
  backupConfiguration(serviceId: string) { return this.get(`/v1/organizations/${this.cfg.orgId}/services/${id(serviceId)}/backupConfiguration`); }
  clickstackSources(serviceId: string) { return this.get(`/v1/organizations/${this.cfg.orgId}/services/${id(serviceId)}/clickstack/sources`); }
  clickstackWebhooks(serviceId: string) { return this.get(`/v1/organizations/${this.cfg.orgId}/services/${id(serviceId)}/clickstack/webhooks`); }
}

function id(value: string): string {
  if (!/^[A-Za-z0-9_-]{1,128}$/.test(value)) throw new Error("Invalid provider resource id");
  return encodeURIComponent(value);
}
