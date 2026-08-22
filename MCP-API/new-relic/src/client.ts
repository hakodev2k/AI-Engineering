import type { Config } from './config.js';

export class NewRelicApiError extends Error {
  constructor(public status: number, public details: unknown, message: string) { super(message); }
}

type GraphQlResponse<T> = { data?: T; errors?: Array<{ message: string; extensions?: unknown }> };

export class NewRelicClient {
  constructor(private readonly config: Config, private readonly fetchImpl: typeof fetch = fetch) {}

  async query<T>(query: string, variables: Record<string, unknown> = {}, isMutation = false): Promise<T> {
    const maxAttempts = isMutation ? 1 : 3;
    let lastError: unknown;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const response = await this.fetchImpl(this.config.endpoint, {
          method: 'POST', signal: controller.signal,
          headers: {
            'API-Key': this.config.apiKey,
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'User-Agent': 'ai-engineering-new-relic-mcp/1.0'
          },
          body: JSON.stringify({ query, variables })
        });
        const payload = await response.json() as GraphQlResponse<T>;
        if (!response.ok) {
          if (response.status === 429 && attempt < maxAttempts) {
            const waitSeconds = Number(response.headers.get('retry-after') ?? 1);
            await new Promise(r => setTimeout(r, Math.min(Math.max(waitSeconds, 0), 5) * 1000));
            continue;
          }
          throw new NewRelicApiError(response.status, payload, `New Relic NerdGraph failed with HTTP ${response.status}`);
        }
        if (payload.errors?.length) {
          throw new NewRelicApiError(200, payload.errors, `New Relic NerdGraph returned ${payload.errors.length} GraphQL error(s)`);
        }
        if (!payload.data) throw new NewRelicApiError(200, payload, 'New Relic NerdGraph returned no data');
        return payload.data;
      } catch (error) {
        lastError = error;
        if (error instanceof NewRelicApiError) throw error;
        if (attempt === maxAttempts) throw new Error(`NETWORK_OR_TIMEOUT: ${error instanceof Error ? error.message : String(error)}`);
        await new Promise(r => setTimeout(r, 250 * 2 ** (attempt - 1)));
      } finally { clearTimeout(timer); }
    }
    throw lastError;
  }
}
