import * as braintree from "braintree";
import type { Config } from "./config.js";

export type GatewayLike = {
  customer: { find(id: string): Promise<unknown>; create(input: Record<string, unknown>): Promise<unknown>; update(id: string, input: Record<string, unknown>): Promise<unknown> };
  clientToken: { generate(input?: Record<string, unknown>): Promise<unknown> };
  transaction: { find(id: string): Promise<unknown>; sale(input: Record<string, unknown>): Promise<unknown>; refund(id: string, amount?: string): Promise<unknown>; void(id: string): Promise<unknown> };
  subscription: { find(id: string): Promise<unknown>; cancel(id: string): Promise<unknown> };
  plan: { all(): Promise<unknown> };
  merchantAccount: { all(): Promise<unknown> };
};

export class BraintreeConnectorError extends Error {
  constructor(message: string, readonly code: string, readonly retryable = false) { super(message); }
}

export function createGateway(config: Config): GatewayLike {
  return new braintree.BraintreeGateway({
    environment: config.environment === "production" ? braintree.Environment.Production : braintree.Environment.Sandbox,
    merchantId: config.merchantId,
    publicKey: config.publicKey,
    privateKey: config.privateKey
  }) as unknown as GatewayLike;
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class BraintreeClient {
  constructor(private config: Config, private gateway: GatewayLike = createGateway(config)) {}

  async call<T>(operation: () => Promise<T>, options: { retryable: boolean } = { retryable: true }): Promise<T> {
    let last: unknown;
    const attempts = options.retryable ? this.config.maxRetries + 1 : 1;
    for (let attempt = 0; attempt < attempts; attempt++) {
      try {
        return await Promise.race([
          operation(),
          new Promise<never>((_, reject) => setTimeout(() => reject(new BraintreeConnectorError("Braintree request timed out.", "TIMEOUT", true)), this.config.timeoutMs))
        ]);
      } catch (error) {
        last = error;
        const mapped = this.mapError(error);
        if (!options.retryable || !mapped.retryable || attempt === attempts - 1) throw mapped;
        await sleep(Math.min(250 * 2 ** attempt, 2000));
      }
    }
    throw this.mapError(last);
  }

  private mapError(error: unknown) {
    if (error instanceof BraintreeConnectorError) return error;
    const e = error as { name?: string; message?: string; type?: string; status?: number };
    const message = e?.message || "Braintree request failed.";
    if (/authentication|authorization|credential|forbidden|not authorized/i.test(message)) return new BraintreeConnectorError("Braintree authentication or permission failure.", "AUTH", false);
    if (/not found/i.test(message)) return new BraintreeConnectorError("Braintree resource was not found.", "NOT_FOUND", false);
    if (/validation|invalid/i.test(message)) return new BraintreeConnectorError(message, "VALIDATION", false);
    if (e?.status === 429 || /rate.?limit|too many requests/i.test(message)) return new BraintreeConnectorError("Braintree rate limit reached; retry later.", "RATE_LIMIT", true);
    if ((e?.status && e.status >= 500) || /network|socket|ECONN|ETIMEDOUT/i.test(message)) return new BraintreeConnectorError("Braintree network or service failure.", "UPSTREAM", true);
    return new BraintreeConnectorError(message, "UPSTREAM", false);
  }
}
