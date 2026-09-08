import { describe, expect, it } from 'vitest';
import { schemas, buildRunQuery } from '../src/tools.js';

describe('schemas', () => {
  it('rejects malformed run IDs', () => {
    expect(() => schemas.runId.parse({ runId: '../etc/passwd' })).toThrow();
  });
  it('limits batch size and tag count', () => {
    expect(() => schemas.batchTrigger.parse({ task: 't', items: [], approved: false })).toThrow();
    expect(() => schemas.taskTrigger.parse({ task: 't', payload: {}, options: { tags: Array(11).fill('x') }, approved: false })).toThrow();
  });
  it('encodes list filters without arbitrary URLs', () => {
    const v = schemas.runList.parse({ limit: 10, status: ['EXECUTING'], taskIdentifier: ['job-a'] });
    const q = buildRunQuery(v);
    expect(q).toContain('page%5Bsize%5D=10');
    expect(q).toContain('EXECUTING');
  });
});
