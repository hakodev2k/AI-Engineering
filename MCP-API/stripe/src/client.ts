import Stripe from 'stripe';
import type { StripeConfig } from './config.js';

export class StripeClient {
  readonly sdk: Stripe;

  constructor(config: StripeConfig) {
    this.sdk = new Stripe(config.apiKey, {
      apiVersion: config.apiVersion as Stripe.LatestApiVersion | undefined,
      maxNetworkRetries: 2,
      timeout: 20_000,
      appInfo: { name: 'ai-engineering-stripe-mcp', version: '1.0.0' }
    });
  }

  accountGet(id: string) { return this.sdk.accounts.retrieve(id); }
  customerList(limit = 20, startingAfter?: string) { return this.sdk.customers.list({ limit, starting_after: startingAfter }); }
  customerGet(id: string) { return this.sdk.customers.retrieve(id); }
  customerCreate(input: { email?: string; name?: string; description?: string }) { return this.sdk.customers.create(input); }
  paymentIntentList(limit = 20, startingAfter?: string) { return this.sdk.paymentIntents.list({ limit, starting_after: startingAfter }); }
  paymentIntentGet(id: string) { return this.sdk.paymentIntents.retrieve(id); }
  refundCreate(input: { payment_intent: string; amount?: number; reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer' }) {
    return this.sdk.refunds.create(input, { idempotencyKey: `mcp-refund-${input.payment_intent}-${input.amount ?? 'full'}` });
  }
  productList(limit = 20, startingAfter?: string) { return this.sdk.products.list({ limit, starting_after: startingAfter, active: true }); }
  priceList(limit = 20, startingAfter?: string) { return this.sdk.prices.list({ limit, starting_after: startingAfter, active: true }); }
  subscriptionList(limit = 20, startingAfter?: string) { return this.sdk.subscriptions.list({ limit, starting_after: startingAfter }); }
  subscriptionGet(id: string) { return this.sdk.subscriptions.retrieve(id); }
}

export function mapStripeError(error: unknown): Error {
  if (error instanceof Stripe.errors.StripeError) {
    const retry = error.statusCode === 429 ? ' Retry after the provider-provided interval.' : '';
    return new Error(`Stripe ${error.type}: ${error.message}.${retry}`);
  }
  return error instanceof Error ? error : new Error('Unknown Stripe error');
}
