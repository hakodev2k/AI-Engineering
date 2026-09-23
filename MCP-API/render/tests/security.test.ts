import { afterEach, describe, expect, it } from 'vitest';
import { assertReadOnlySql, requireApproval } from '../src/security.js';

afterEach(() => { delete process.env.RENDER_ALLOW_WRITES; delete process.env.RENDER_ALLOW_HIGH_RISK; });
describe('security policy', () => {
  it('accepts safe read-only SQL', () => { expect(() => assertReadOnlySql('SELECT id FROM users LIMIT 10')).not.toThrow(); expect(() => assertReadOnlySql('WITH x AS (SELECT 1) SELECT * FROM x')).not.toThrow(); });
  it('rejects mutation and multi-statement SQL', () => { expect(() => assertReadOnlySql('DELETE FROM users')).toThrow(); expect(() => assertReadOnlySql('SELECT 1; DROP TABLE users')).toThrow(); });
  it('permits reads without approval', () => expect(() => requireApproval('READ', false)).not.toThrow());
  it('denies high-risk without both human opt-in and confirmation', () => { expect(() => requireApproval('HIGH_RISK', true)).toThrow(); process.env.RENDER_ALLOW_HIGH_RISK='true'; expect(() => requireApproval('HIGH_RISK', false)).toThrow(); expect(() => requireApproval('HIGH_RISK', true)).not.toThrow(); });
  it('always denies destructive operations', () => { process.env.RENDER_ALLOW_HIGH_RISK='true'; expect(() => requireApproval('DESTRUCTIVE', true)).toThrow(); });
});
