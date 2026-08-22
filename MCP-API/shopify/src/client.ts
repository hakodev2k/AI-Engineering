import type { Config } from './config.js';

export class ShopifyApiError extends Error {
  constructor(public status: number, public details: unknown, message: string) { super(message); }
}

export type GraphQLResponse<T> = {
  data?: T;
  errors?: Array<{ message: string; extensions?: unknown }>;
  extensions?: { cost?: { requestedQueryCost?: number; actualQueryCost?: number; throttleStatus?: { maximumAvailable?: number; currentlyAvailable?: number; restoreRate?: number } } };
};

export class ShopifyClient {
  constructor(private readonly config: Config, private readonly fetchImpl: typeof fetch = fetch) {}

  async graphql<T>(query: string, variables: Record<string, unknown> = {}, mutation = false): Promise<T> {
    const url = `https://${this.config.shopDomain}/admin/api/${this.config.apiVersion}/graphql.json`;
    const maxAttempts = mutation ? 1 : 3;
    let lastError: unknown;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const response = await this.fetchImpl(url, {
          method: 'POST',
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-Shopify-Access-Token': this.config.accessToken,
            'User-Agent': 'ai-engineering-shopify-mcp/1.0'
          },
          body: JSON.stringify({ query, variables })
        });

        const text = await response.text();
        let payload: GraphQLResponse<T> | { raw: string } = { raw: text };
        if (text) {
          try { payload = JSON.parse(text) as GraphQLResponse<T>; } catch { /* keep raw */ }
        }

        if (response.status === 429 && !mutation && attempt < maxAttempts) {
          const retryAfter = Number(response.headers.get('retry-after') ?? 1);
          await new Promise(resolve => setTimeout(resolve, Math.min(Math.max(retryAfter, 0), 10) * 1000));
          continue;
        }

        if (!response.ok) throw new ShopifyApiError(response.status, payload, `Shopify GraphQL request failed with HTTP ${response.status}`);
        const gql = payload as GraphQLResponse<T>;
        if (gql.errors?.length) {
          const throttled = gql.errors.some(e => e.message.toLowerCase().includes('throttled'));
          if (throttled && !mutation && attempt < maxAttempts) {
            const status = gql.extensions?.cost?.throttleStatus;
            const deficit = Math.max(1, 10 - (status?.currentlyAvailable ?? 0));
            const waitMs = Math.min(10000, Math.ceil((deficit / Math.max(status?.restoreRate ?? 50, 1)) * 1000));
            await new Promise(resolve => setTimeout(resolve, waitMs));
            continue;
          }
          throw new ShopifyApiError(200, gql.errors, `Shopify GraphQL error: ${gql.errors.map(e => e.message).join('; ')}`);
        }
        if (gql.data === undefined) throw new ShopifyApiError(200, gql, 'Shopify GraphQL response did not contain data');
        return gql.data;
      } catch (error) {
        lastError = error;
        if (error instanceof ShopifyApiError) throw error;
        if (attempt === maxAttempts) throw new Error(`NETWORK_OR_TIMEOUT: ${error instanceof Error ? error.message : String(error)}`);
        await new Promise(resolve => setTimeout(resolve, 250 * 2 ** (attempt - 1)));
      } finally {
        clearTimeout(timer);
      }
    }
    throw lastError;
  }
}

export function assertNoUserErrors(payload: Record<string, any>, mutationField: string) {
  const result = payload[mutationField];
  const errors = result?.userErrors;
  if (Array.isArray(errors) && errors.length) {
    throw new Error(`SHOPIFY_USER_ERROR: ${errors.map((e: any) => `${e.field?.join('.') ?? 'input'}: ${e.message}`).join('; ')}`);
  }
  return result;
}
