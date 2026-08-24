import pg from 'pg';
import type { PostgresConfig } from './config.js';

const { Pool } = pg;
export type Scalar = string | number | boolean | null;

export class PostgresClient {
  readonly pool: pg.Pool;
  constructor(private readonly config: PostgresConfig) {
    this.pool = new Pool({
      connectionString: config.connectionString,
      ssl: config.ssl,
      max: config.poolMax,
      connectionTimeoutMillis: config.connectionTimeoutMs,
      idleTimeoutMillis: 30000,
      application_name: 'ai-engineering-postgresql-mcp'
    });
  }

  async close() { await this.pool.end(); }

  async query<T = Record<string, unknown>>(text: string, values: unknown[] = []): Promise<{ rows: T[]; rowCount: number }> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN READ ONLY');
      await client.query(`SET LOCAL statement_timeout = '${this.config.statementTimeoutMs}ms'`);
      const result = await client.query(text, values);
      await client.query('COMMIT');
      return { rows: result.rows as T[], rowCount: result.rowCount ?? 0 };
    } catch (error) {
      await client.query('ROLLBACK').catch(() => undefined);
      throw error;
    } finally {
      client.release();
    }
  }

  async write<T = Record<string, unknown>>(text: string, values: unknown[] = []): Promise<{ rows: T[]; rowCount: number }> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(`SET LOCAL statement_timeout = '${this.config.statementTimeoutMs}ms'`);
      const result = await client.query(text, values);
      await client.query('COMMIT');
      return { rows: result.rows as T[], rowCount: result.rowCount ?? 0 };
    } catch (error) {
      await client.query('ROLLBACK').catch(() => undefined);
      throw error;
    } finally {
      client.release();
    }
  }
}

export function quoteIdent(identifier: string): string {
  if (!/^[A-Za-z_][A-Za-z0-9_$]{0,62}$/.test(identifier)) throw new Error(`Unsafe SQL identifier: ${identifier}`);
  return `"${identifier.replaceAll('"', '""')}"`;
}

export function qualified(schema: string, table: string) {
  return `${quoteIdent(schema)}.${quoteIdent(table)}`;
}

export function whereClause(filters: Record<string, Scalar> | undefined, startAt = 1) {
  const entries = Object.entries(filters ?? {});
  const values: Scalar[] = [];
  const clauses = entries.map(([column, value], index) => {
    const ident = quoteIdent(column);
    if (value === null) return `${ident} IS NULL`;
    values.push(value);
    return `${ident} = $${startAt + values.length - 1}`;
  });
  return { sql: clauses.length ? ` WHERE ${clauses.join(' AND ')}` : '', values, count: values.length };
}
