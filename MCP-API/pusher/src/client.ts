import Pusher from "pusher";
import type { Config } from "./config.js";

export class PusherClient {
  private readonly sdk: Pusher;
  constructor(private readonly cfg: Config) {
    this.sdk = new Pusher({
      appId: cfg.appId,
      key: cfg.key,
      secret: cfg.secret,
      cluster: cfg.cluster,
      useTLS: cfg.useTLS,
      timeout: cfg.timeoutMs
    });
  }

  private async json(response: Response): Promise<unknown> {
    if (!response.ok) {
      const body = await response.text().catch(() => "");
      const err = new Error(`Pusher API ${response.status}: ${body.slice(0, 500)}`);
      (err as Error & { status?: number }).status = response.status;
      throw err;
    }
    const text = await response.text();
    return text ? JSON.parse(text) : { ok: true, status: response.status };
  }

  async listChannels(filterByPrefix?: string, info?: string) {
    const params: Record<string, string> = {};
    if (filterByPrefix) params.filter_by_prefix = filterByPrefix;
    if (info) params.info = info;
    return this.json(await this.sdk.get({ path: "/channels", params }) as unknown as Response);
  }

  async getChannel(channel: string, info?: string) {
    return this.json(await this.sdk.get({ path: `/channels/${encodeURIComponent(channel)}`, params: info ? { info } : {} }) as unknown as Response);
  }

  async listPresenceUsers(channel: string) {
    return this.json(await this.sdk.get({ path: `/channels/${encodeURIComponent(channel)}/users`, params: {} }) as unknown as Response);
  }

  async publish(channels: string[], event: string, data: unknown, socketId?: string) {
    const response = await this.sdk.trigger(channels.length === 1 ? channels[0] : channels, event, data, socketId ? { socket_id: socketId } : undefined);
    return this.json(response as unknown as Response);
  }

  async publishBatch(events: Array<{ channel: string; name: string; data: unknown; socket_id?: string }>) {
    return this.json(await this.sdk.triggerBatch(events) as unknown as Response);
  }

  async publishToUser(userId: string, event: string, data: unknown) {
    return this.json(await this.sdk.sendToUser(userId, event, data) as unknown as Response);
  }

  async terminateUserConnections(userId: string) {
    return this.json(await this.sdk.terminateUserConnections(userId) as unknown as Response);
  }

  verifyWebhook(headers: Record<string, string>, rawBody: string) {
    const webhook = this.sdk.webhook({ headers, rawBody });
    if (!webhook.isValid()) throw new Error("Invalid Pusher webhook signature or payload.");
    return { valid: true, time: webhook.getTime().toISOString(), events: webhook.getEvents() };
  }
}
