import { WebClient, type WebAPICallResult } from "@slack/web-api";
import type { ConnectorConfig } from "./config.js";

export class SlackConnectorClient {
  private readonly bot?: WebClient;
  private readonly user?: WebClient;

  constructor(private readonly config: ConnectorConfig) {
    const options = {
      timeout: config.requestTimeoutMs,
      retryConfig: { retries: config.maxRetries }
    };
    this.bot = config.botToken ? new WebClient(config.botToken, options) : undefined;
    this.user = config.userToken ? new WebClient(config.userToken, options) : undefined;
  }

  private client(requireUser = false): WebClient {
    if (requireUser) {
      if (!this.user) throw new Error("This operation requires SLACK_USER_TOKEN.");
      return this.user;
    }
    if (this.bot) return this.bot;
    if (this.user) return this.user;
    throw new Error("No Slack credential is configured.");
  }

  async call(method: string, args: Record<string, unknown> = {}, requireUser = false): Promise<WebAPICallResult> {
    try {
      return await this.client(requireUser).apiCall(method, args);
    } catch (error: any) {
      const providerError = error?.data?.error ?? error?.code ?? error?.message ?? "unknown_error";
      const retryAfter = error?.retryAfter ?? error?.data?.retry_after;
      const suffix = retryAfter ? ` Retry after ${retryAfter} seconds.` : "";
      throw new Error(`Slack API ${method} failed: ${providerError}.${suffix}`);
    }
  }
}
