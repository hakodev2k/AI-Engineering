import crypto from 'node:crypto';
import type { SnowflakeConfig } from './config.js';

export interface StatementContext {
  warehouse?: string;
  database?: string;
  schema?: string;
  role?: string;
  timeout?: number;
}

export interface Binding {
  type: 'TEXT' | 'FIXED' | 'REAL' | 'BOOLEAN';
  value: string;
}

export class SnowflakeApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code?: string,
    public readonly sqlState?: string,
    public readonly retryAfterSeconds?: number
  ) { super(message); }
}

export class SnowflakeClient {
  constructor(private readonly config: SnowflakeConfig, private readonly fetchImpl: typeof fetch = fetch) {}

  private headers() {
    return {
      Authorization: `Bearer ${this.config.token}`,
      'X-Snowflake-Authorization-Token-Type': this.config.tokenType,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': 'ai-engineering-snowflake-mcp-connector/1.0.0'
    };
  }

  private async request<T>(method: string, path: string, body?: unknown, retrySafe = false): Promise<T> {
    const url = new URL(path, `${this.config.accountUrl}/`);
    for (let attempt = 0; ; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const res = await this.fetchImpl(url, {
          method,
          headers: this.headers(),
          signal: controller.signal,
          body: body === undefined ? undefined : JSON.stringify(body)
        });
        const retryAfter = Number(res.headers.get('retry-after') ?? 0) || undefined;
        const text = await res.text();
        let parsed: any = undefined;
        if (text) {
          try { parsed = JSON.parse(text); } catch { parsed = { message: text.slice(0, 4000) }; }
        }
        if (!res.ok && res.status !== 202) {
          const canRetry = retrySafe && attempt < this.config.maxRetries && (res.status === 429 || res.status === 500 || res.status === 502 || res.status === 503 || res.status === 504);
          if (canRetry) {
            const delay = retryAfter ? retryAfter * 1000 : Math.min(8000, 300 * 2 ** attempt) + Math.floor(Math.random() * 200);
            await new Promise(r => setTimeout(r, delay));
            continue;
          }
          throw new SnowflakeApiError(res.status, parsed?.message ?? `Snowflake API ${res.status}`, parsed?.code, parsed?.sqlState, retryAfter);
        }
        return parsed as T;
      } catch (err) {
        if (err instanceof SnowflakeApiError) throw err;
        if (err instanceof DOMException && err.name === 'AbortError') throw new Error(`Snowflake request timed out after ${this.config.timeoutMs}ms`);
        if (!retrySafe || attempt >= this.config.maxRetries) throw err;
        await new Promise(r => setTimeout(r, Math.min(8000, 300 * 2 ** attempt) + Math.floor(Math.random() * 200)));
      } finally {
        clearTimeout(timer);
      }
    }
  }

  async execute(statement: string, context: StatementContext = {}, bindings?: Record<string, Binding>, async = false, retrySafe = false) {
    const requestId = crypto.randomUUID();
    const query = new URLSearchParams({ requestId });
    if (async) query.set('async', 'true');
    if (retrySafe) query.set('retry', 'true');
    const body = {
      statement,
      warehouse: context.warehouse ?? this.config.warehouse,
      database: context.database ?? this.config.database,
      schema: context.schema ?? this.config.schema,
      role: context.role ?? this.config.role,
      timeout: context.timeout,
      bindings
    };
    return this.request<any>('POST', `/api/v2/statements?${query.toString()}`, body, retrySafe);
  }

  async status(statementHandle: string, partition?: number) {
    const suffix = partition === undefined ? '' : `?partition=${partition}`;
    return this.request<any>('GET', `/api/v2/statements/${encodeURIComponent(statementHandle)}${suffix}`, undefined, true);
  }

  async cancel(statementHandle: string) {
    return this.request<any>('POST', `/api/v2/statements/${encodeURIComponent(statementHandle)}/cancel`, undefined, false);
  }
}

export function quoteIdentifier(value: string) {
  if (!/^[A-Za-z_][A-Za-z0-9_$]{0,254}$/.test(value)) throw new Error(`Unsafe Snowflake identifier: ${value}`);
  return `"${value.replace(/"/g, '""')}"`;
}

export function inferBinding(value: string | number | boolean): Binding {
  if (typeof value === 'boolean') return { type: 'BOOLEAN', value: value ? 'true' : 'false' };
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new Error('Numeric binding must be finite');
    return { type: Number.isInteger(value) ? 'FIXED' : 'REAL', value: String(value) };
  }
  return { type: 'TEXT', value };
}
