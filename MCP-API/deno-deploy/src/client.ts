import { Client } from '@deno/sandbox';
import { requireToken } from './auth.js';

export class ProviderError extends Error { constructor(public code: string, message: string, public retryAfterMs?: number) { super(message); } }

export class DenoDeployClient {
  readonly sdk: Client;
  readonly timeoutMs: number;
  constructor(env: NodeJS.ProcessEnv = process.env) {
    requireToken(env);
    this.timeoutMs = Number(env.DENO_DEPLOY_TIMEOUT_MS ?? 20000);
    if (!Number.isFinite(this.timeoutMs) || this.timeoutMs < 1000 || this.timeoutMs > 120000) throw new Error('VALIDATION: invalid DENO_DEPLOY_TIMEOUT_MS');
    this.sdk = new Client();
  }
  async run<T>(fn: () => Promise<T>, retryable = true): Promise<T> {
    let last: unknown;
    for (let attempt = 0; attempt < (retryable ? 3 : 1); attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeoutMs);
      try {
        return await Promise.race([fn(), new Promise<never>((_, reject) => controller.signal.addEventListener('abort', () => reject(new ProviderError('TIMEOUT', 'Deno Deploy request timed out'))))]);
      } catch (e) {
        last = e;
        const msg = e instanceof Error ? e.message : String(e);
        if (/401|403|unauthorized|forbidden|validation|invalid/i.test(msg) || attempt === 2 || !retryable) throw this.map(e);
        const retryAfter = /429|rate.?limit|throttl/i.test(msg) ? 1000 * (attempt + 1) : 250 * 2 ** attempt;
        await new Promise(r => setTimeout(r, retryAfter));
      } finally { clearTimeout(timer); }
    }
    throw this.map(last);
  }
  map(e: unknown): ProviderError {
    if (e instanceof ProviderError) return e;
    const m = e instanceof Error ? e.message : String(e);
    if (/401|unauthorized/i.test(m)) return new ProviderError('AUTHENTICATION', 'Deno Deploy authentication failed');
    if (/403|forbidden/i.test(m)) return new ProviderError('PERMISSION', 'Deno Deploy permission denied');
    if (/429|rate.?limit|throttl/i.test(m)) return new ProviderError('RATE_LIMITED', 'Deno Deploy rate limit reached');
    return new ProviderError('PROVIDER_ERROR', m);
  }
}
