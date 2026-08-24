import { describe, expect, it } from 'vitest';
import { assertTargetAllowed, loadConfig } from '../src/config.js';
import { approvalDigest, assertApproval } from '../src/policy.js';
import { qualified, quoteIdent, whereClause } from '../src/client.js';

describe('configuration and security', () => {
  it('requires a database URL', () => {
    expect(() => loadConfig({})).toThrow(/POSTGRES_DATABASE_URL/);
  });

  it('parses allowlists and safe defaults', () => {
    const c = loadConfig({ POSTGRES_DATABASE_URL: 'postgresql://u:p@localhost/db', POSTGRES_SSL_MODE: 'disable', POSTGRES_ALLOWED_SCHEMAS: 'public,app', POSTGRES_ALLOWED_TABLES: 'app.users' });
    expect(c.enableDelete).toBe(false);
    expect(c.allowedSchemas.has('app')).toBe(true);
    expect(() => assertTargetAllowed(c, 'app', 'users')).not.toThrow();
    expect(() => assertTargetAllowed(c, 'public', 'secrets')).toThrow(/Table not allowed/);
  });

  it('rejects unsafe identifiers', () => {
    expect(quoteIdent('users')).toBe('"users"');
    expect(() => quoteIdent('users; DROP TABLE x')).toThrow(/Unsafe SQL identifier/);
    expect(qualified('public', 'users')).toBe('"public"."users"');
  });

  it('builds parameterized filters including NULL', () => {
    const w = whereClause({ tenant_id: 7, deleted_at: null });
    expect(w.sql).toContain('"tenant_id" = $1');
    expect(w.sql).toContain('"deleted_at" IS NULL');
    expect(w.values).toEqual([7]);
  });

  it('enforces approval tokens', () => {
    const secret = 'test-secret';
    const token = approvalDigest(secret, 'postgresql.row.update');
    expect(() => assertApproval('postgresql.row.update', token, secret)).not.toThrow();
    expect(() => assertApproval('postgresql.row.update', '0'.repeat(64), secret)).toThrow(/Invalid approval/);
    expect(() => assertApproval('postgresql.row.update', undefined, secret)).toThrow(/Explicit approval/);
  });
});
