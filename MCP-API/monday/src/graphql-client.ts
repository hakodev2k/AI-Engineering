import type { Config } from './config.js';

export class MondayGraphqlError extends Error {
  constructor(public readonly status: number, public readonly details: unknown, message: string) {
    super(message);
  }
}

type GraphqlEnvelope<T> = { data?: T; errors?: Array<{ message?: string; extensions?: Record<string, unknown> }> };

export class MondayGraphqlClient {
  constructor(private readonly config: Config, private readonly fetchImpl: typeof fetch = fetch) {}

  async execute<T>(query: string, variables: Record<string, unknown>, mutation = false): Promise<T> {
    const maxAttempts = mutation ? 1 : 3;
    let lastError: unknown;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const response = await this.fetchImpl(this.config.apiUrl, {
          method: 'POST',
          signal: controller.signal,
          headers: {
            Authorization: this.config.apiToken,
            'Content-Type': 'application/json',
            'API-Version': this.config.apiVersion,
            'User-Agent': 'ai-engineering-monday-mcp/1.0'
          },
          body: JSON.stringify({ query, variables })
        });

        const raw = await response.text();
        let payload: GraphqlEnvelope<T> | { raw: string } = { raw };
        try { payload = raw ? JSON.parse(raw) as GraphqlEnvelope<T> : {}; } catch { /* keep raw */ }

        if (response.status === 429 && attempt < maxAttempts) {
          const retryAfter = Number(response.headers.get('retry-after') ?? 1);
          await new Promise(resolve => setTimeout(resolve, Math.min(Math.max(retryAfter, 0), 10) * 1000));
          continue;
        }

        if (!response.ok) {
          throw new MondayGraphqlError(response.status, payload, `monday GraphQL request failed with HTTP ${response.status}`);
        }

        if ('errors' in payload && payload.errors?.length) {
          const retrySeconds = Number(payload.errors[0]?.extensions?.retry_in_seconds ?? 0);
          const code = String(payload.errors[0]?.extensions?.code ?? '');
          const rateLimited = retrySeconds > 0 || code.includes('LIMIT') || code.includes('RATE');
          if (!mutation && rateLimited && attempt < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, Math.min(Math.max(retrySeconds, 1), 10) * 1000));
            continue;
          }
          throw new MondayGraphqlError(200, payload.errors, `monday GraphQL error: ${payload.errors.map(x => x.message ?? 'unknown').join('; ')}`);
        }

        if (!('data' in payload) || payload.data === undefined) {
          throw new MondayGraphqlError(200, payload, 'monday GraphQL response did not contain data');
        }
        return payload.data;
      } catch (error) {
        lastError = error;
        if (error instanceof MondayGraphqlError) throw error;
        if (attempt === maxAttempts) {
          throw new Error(`NETWORK_OR_TIMEOUT: ${error instanceof Error ? error.message : String(error)}`);
        }
        await new Promise(resolve => setTimeout(resolve, 250 * 2 ** (attempt - 1)));
      } finally {
        clearTimeout(timer);
      }
    }
    throw lastError;
  }
}
