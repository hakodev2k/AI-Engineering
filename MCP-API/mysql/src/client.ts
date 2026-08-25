import mysqlx from '@mysql/xdevapi';
import type { Config } from './config.js';

export type Scalar = string | number | boolean | null;
export type Filter = { column: string; value: Scalar };

export class MySqlClient {
  constructor(private readonly config: Config) {}

  private ident(value: string) {
    if (!/^[A-Za-z_][A-Za-z0-9_$]{0,63}$/.test(value)) throw new Error(`Invalid identifier: ${value}`);
    return `\`${value}\``;
  }

  private async withSession<T>(fn: (session: any) => Promise<T>): Promise<T> {
    const session = await this.withTimeout(mysqlx.getSession(this.config.uri));
    try { return await fn(session); } finally { await session.close().catch(() => undefined); }
  }

  private async withTimeout<T>(p: Promise<T>): Promise<T> {
    let timer: NodeJS.Timeout | undefined;
    try {
      return await Promise.race([
        p,
        new Promise<T>((_, reject) => { timer = setTimeout(() => reject(new Error('MySQL operation timed out')), this.config.timeoutMs); })
      ]);
    } finally { if (timer) clearTimeout(timer); }
  }

  private async sql(session: any, statement: string, values: Scalar[] = []) {
    let q = session.sql(statement);
    if (values.length) q = q.bind(values);
    const result = await this.withTimeout(q.execute());
    const rows = typeof result.fetchAll === 'function' ? result.fetchAll() : [];
    return { rows: rows.slice(0, this.config.maxRows), affected: result.getAffectedItemsCount?.() ?? 0 };
  }

  async health() {
    return this.withSession(async s => {
      const { rows } = await this.sql(s, 'SELECT VERSION(), CURRENT_USER(), DATABASE()');
      return { ok: true, server: rows[0] ?? null };
    });
  }

  async listSchemas() {
    return this.withSession(async s => (await this.sql(s, 'SELECT SCHEMA_NAME FROM information_schema.SCHEMATA ORDER BY SCHEMA_NAME')).rows);
  }

  async listTables(schema: string) {
    this.ident(schema);
    return this.withSession(async s => (await this.sql(s, 'SELECT TABLE_NAME, TABLE_TYPE, ENGINE, TABLE_ROWS FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? ORDER BY TABLE_NAME', [schema])).rows);
  }

  async describeTable(schema: string, table: string) {
    this.ident(schema); this.ident(table);
    return this.withSession(async s => (await this.sql(s, 'SELECT COLUMN_NAME, ORDINAL_POSITION, COLUMN_DEFAULT, IS_NULLABLE, DATA_TYPE, COLUMN_TYPE, COLUMN_KEY, EXTRA FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? ORDER BY ORDINAL_POSITION', [schema, table])).rows);
  }

  async selectRows(schema: string, table: string, filters: Filter[] = [], limit = 50) {
    const target = `${this.ident(schema)}.${this.ident(table)}`;
    const capped = Math.min(Math.max(limit, 1), this.config.maxRows);
    const values: Scalar[] = [];
    const where = filters.length ? ` WHERE ${filters.map(f => { values.push(f.value); return `${this.ident(f.column)} = ?`; }).join(' AND ')}` : '';
    return this.withSession(async s => (await this.sql(s, `SELECT * FROM ${target}${where} LIMIT ${capped}`, values)).rows);
  }

  async getRow(schema: string, table: string, keyColumn: string, keyValue: Scalar) {
    const rows = await this.selectRows(schema, table, [{ column: keyColumn, value: keyValue }], 1);
    return rows[0] ?? null;
  }

  async insertRow(schema: string, table: string, values: Record<string, Scalar>) {
    const entries = Object.entries(values);
    if (!entries.length || entries.length > 100) throw new Error('values must contain 1..100 fields');
    const target = `${this.ident(schema)}.${this.ident(table)}`;
    const columns = entries.map(([k]) => this.ident(k)).join(', ');
    const placeholders = entries.map(() => '?').join(', ');
    return this.withSession(async s => this.sql(s, `INSERT INTO ${target} (${columns}) VALUES (${placeholders})`, entries.map(([,v]) => v)));
  }

  async updateRow(schema: string, table: string, keyColumn: string, keyValue: Scalar, values: Record<string, Scalar>) {
    const entries = Object.entries(values);
    if (!entries.length || entries.length > 100) throw new Error('values must contain 1..100 fields');
    if (entries.some(([k]) => k === keyColumn)) throw new Error('Updating the key column is not allowed');
    const target = `${this.ident(schema)}.${this.ident(table)}`;
    const set = entries.map(([k]) => `${this.ident(k)} = ?`).join(', ');
    return this.withSession(async s => this.sql(s, `UPDATE ${target} SET ${set} WHERE ${this.ident(keyColumn)} = ? LIMIT 1`, [...entries.map(([,v]) => v), keyValue]));
  }

  async deleteRow(schema: string, table: string, keyColumn: string, keyValue: Scalar) {
    const target = `${this.ident(schema)}.${this.ident(table)}`;
    return this.withSession(async s => this.sql(s, `DELETE FROM ${target} WHERE ${this.ident(keyColumn)} = ? LIMIT 1`, [keyValue]));
  }

  async readQuery(query: string, params: Scalar[] = []) {
    const sql = query.trim();
    if (sql.length < 1 || sql.length > 20000) throw new Error('query length must be 1..20000');
    if (/;\s*\S/.test(sql) || /\/\*|--\s|#/.test(sql)) throw new Error('Multiple statements and SQL comments are not allowed');
    if (!/^(SELECT|SHOW|EXPLAIN|DESCRIBE)\b/i.test(sql)) throw new Error('Only read-only SELECT/SHOW/EXPLAIN/DESCRIBE statements are allowed');
    return this.withSession(async s => (await this.sql(s, sql.replace(/;\s*$/, ''), params)).rows);
  }
}
