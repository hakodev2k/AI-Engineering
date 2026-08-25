import { describe, expect, it } from 'vitest';
import { loadConfig, approvalDigest } from '../src/config.js';
import { assertPermission } from '../src/policy.js';
import { MySqlClient } from '../src/client.js';

describe('MySQL connector configuration and safety', () => {
  it('requires a mysqlx URI', () => {
    expect(() => loadConfig({})).toThrow(/MYSQL_XDEVAPI_URI/);
    expect(() => loadConfig({ MYSQL_XDEVAPI_URI: 'mysql://x' })).toThrow(/mysqlx:\/\//);
  });

  it('bounds operational settings', () => {
    expect(() => loadConfig({ MYSQL_XDEVAPI_URI: 'mysqlx://u:p@localhost:33060/db', MYSQL_MAX_ROWS: '5000' })).toThrow();
    const cfg = loadConfig({ MYSQL_XDEVAPI_URI: 'mysqlx://u:p@localhost:33060/db', MYSQL_MAX_ROWS: '25' });
    expect(cfg.maxRows).toBe(25);
    expect(cfg.allowWrites).toBe(false);
  });

  it('denies writes when disabled', () => {
    const cfg = loadConfig({ MYSQL_XDEVAPI_URI: 'mysqlx://u:p@localhost:33060/db', MYSQL_APPROVAL_SECRET: 'secret' });
    expect(() => assertPermission(cfg, 'mysql.row.insert')).toThrow(/disabled/);
  });

  it('requires valid approval for enabled writes', () => {
    const cfg = loadConfig({ MYSQL_XDEVAPI_URI: 'mysqlx://u:p@localhost:33060/db', MYSQL_APPROVAL_SECRET: 'secret', MYSQL_ALLOW_WRITES: 'true' });
    expect(() => assertPermission(cfg, 'mysql.row.insert')).toThrow(/approval/);
    const nonce = 'request-12345';
    const digest = approvalDigest('secret', 'mysql.row.insert', nonce);
    expect(() => assertPermission(cfg, 'mysql.row.insert', { nonce, digest })).not.toThrow();
  });

  it('keeps destructive operations separately disabled', () => {
    const cfg = loadConfig({ MYSQL_XDEVAPI_URI: 'mysqlx://u:p@localhost:33060/db', MYSQL_APPROVAL_SECRET: 'secret', MYSQL_ALLOW_WRITES: 'true' });
    expect(() => assertPermission(cfg, 'mysql.row.delete', { nonce: 'request-12345', digest: '0'.repeat(64) })).toThrow(/Destructive operations are disabled/);
  });

  it('rejects non-read-only and multi-statement raw queries before connecting', async () => {
    const cfg = loadConfig({ MYSQL_XDEVAPI_URI: 'mysqlx://u:p@localhost:33060/db' });
    const client = new MySqlClient(cfg);
    await expect(client.readQuery('DROP TABLE users')).rejects.toThrow(/read-only/);
    await expect(client.readQuery('SELECT 1; DELETE FROM users')).rejects.toThrow(/Multiple statements/);
    await expect(client.readQuery('SELECT 1 -- comment')).rejects.toThrow(/comments/);
  });

  it('rejects empty writes before connecting', async () => {
    const cfg = loadConfig({ MYSQL_XDEVAPI_URI: 'mysqlx://u:p@localhost:33060/db' });
    const client = new MySqlClient(cfg);
    await expect(client.insertRow('app', 'users', {})).rejects.toThrow(/1\.\.100 fields/);
  });
});
