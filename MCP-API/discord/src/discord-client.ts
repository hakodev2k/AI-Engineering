export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

export class DiscordApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: number,
    public readonly retryAfterSeconds?: number,
  ) {
    super(message);
  }
}

export interface DiscordClientOptions {
  token: string;
  baseUrl?: string;
  timeoutMs?: number;
  maxRetries?: number;
  fetchImpl?: typeof fetch;
}

export class DiscordClient {
  private readonly baseUrl: string;
  private readonly timeoutMs: number;
  private readonly maxRetries: number;
  private readonly fetchImpl: typeof fetch;

  constructor(private readonly options: DiscordClientOptions) {
    if (!options.token?.trim()) throw new Error("DISCORD_BOT_TOKEN is required");
    this.baseUrl = (options.baseUrl ?? "https://discord.com/api/v10").replace(/\/$/, "");
    this.timeoutMs = options.timeoutMs ?? 10_000;
    this.maxRetries = options.maxRetries ?? 2;
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  async request<T extends Json>(method: string, path: string, body?: Json, signal?: AbortSignal): Promise<T> {
    let attempt = 0;
    for (;;) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
      const abort = () => controller.abort();
      signal?.addEventListener("abort", abort, { once: true });
      try {
        const response = await this.fetchImpl(`${this.baseUrl}${path}`, {
          method,
          headers: {
            Authorization: `Bot ${this.options.token}`,
            "Content-Type": "application/json",
            "User-Agent": "AI-Engineering-Discord-MCP/1.0"
          },
          body: body === undefined ? undefined : JSON.stringify(body),
          signal: controller.signal
        });

        const text = await response.text();
        const payload = text ? JSON.parse(text) : null;

        if (response.ok) return payload as T;

        const retryAfter = Number(response.headers.get("retry-after") ?? payload?.retry_after ?? 0);
        const code = typeof payload?.code === "number" ? payload.code : undefined;
        const message = typeof payload?.message === "string" ? payload.message : `Discord API error ${response.status}`;

        if (response.status === 429 && attempt < this.maxRetries) {
          attempt++;
          await sleep(Math.max(0, retryAfter) * 1000, signal);
          continue;
        }
        if (response.status >= 500 && attempt < this.maxRetries) {
          const delay = 250 * 2 ** attempt++;
          await sleep(delay, signal);
          continue;
        }

        throw new DiscordApiError(message, response.status, code, retryAfter || undefined);
      } catch (error) {
        if (error instanceof DiscordApiError) throw error;
        if (controller.signal.aborted && signal?.aborted) throw new Error("Operation cancelled");
        if (controller.signal.aborted) throw new Error(`Discord request timed out after ${this.timeoutMs}ms`);
        if (attempt < this.maxRetries) {
          const delay = 250 * 2 ** attempt++;
          await sleep(delay, signal);
          continue;
        }
        throw error;
      } finally {
        clearTimeout(timeout);
        signal?.removeEventListener("abort", abort);
      }
    }
  }

  getGuild(guildId: string) { return this.request<Json>("GET", `/guilds/${guildId}`); }
  listGuildChannels(guildId: string) { return this.request<Json>("GET", `/guilds/${guildId}/channels`); }
  getChannel(channelId: string) { return this.request<Json>("GET", `/channels/${channelId}`); }
  listMessages(channelId: string, limit: number, before?: string) {
    const params = new URLSearchParams({ limit: String(limit) });
    if (before) params.set("before", before);
    return this.request<Json>("GET", `/channels/${channelId}/messages?${params}`);
  }
  getMessage(channelId: string, messageId: string) { return this.request<Json>("GET", `/channels/${channelId}/messages/${messageId}`); }
  sendMessage(channelId: string, content: string) { return this.request<Json>("POST", `/channels/${channelId}/messages`, { content }); }
  editMessage(channelId: string, messageId: string, content: string) { return this.request<Json>("PATCH", `/channels/${channelId}/messages/${messageId}`, { content }); }
  deleteMessage(channelId: string, messageId: string) { return this.request<Json>("DELETE", `/channels/${channelId}/messages/${messageId}`); }
  addReaction(channelId: string, messageId: string, emoji: string) {
    return this.request<Json>("PUT", `/channels/${channelId}/messages/${messageId}/reactions/${encodeURIComponent(emoji)}/@me`);
  }
  startThreadFromMessage(channelId: string, messageId: string, name: string, autoArchiveDuration: number) {
    return this.request<Json>("POST", `/channels/${channelId}/messages/${messageId}/threads`, { name, auto_archive_duration: autoArchiveDuration });
  }
  startThread(channelId: string, name: string, autoArchiveDuration: number, type = 11) {
    return this.request<Json>("POST", `/channels/${channelId}/threads`, { name, auto_archive_duration: autoArchiveDuration, type });
  }
}

async function sleep(ms: number, signal?: AbortSignal) {
  if (ms <= 0) return;
  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    const abort = () => { clearTimeout(timer); reject(new Error("Operation cancelled")); };
    signal?.addEventListener("abort", abort, { once: true });
  });
}
