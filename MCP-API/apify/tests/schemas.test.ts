import { describe, expect, it } from 'vitest';
import { actorId, recordKey, resourceId } from '../src/config.js';
import { TOOL_NAMES } from '../src/server.js';

describe('schemas and tool registration contract', () => {
  it('exports exactly the implemented stable tool names', () => {
    expect(TOOL_NAMES).toEqual([
      'apify.account.get', 'apify.actor.get', 'apify.actor.runs.list', 'apify.actor.run', 'apify.task.run',
      'apify.run.get', 'apify.run.abort', 'apify.run.log', 'apify.dataset.items.list', 'apify.kv.record.get',
      'apify.webhook.list', 'apify.webhook.create', 'apify.webhook.delete',
    ]);
  });

  it('accepts documented Actor owner~name identifiers but rejects ambiguous paths', () => {
    expect(actorId.parse('compass~google-maps-extractor')).toBe('compass~google-maps-extractor');
    expect(() => actorId.parse('../actor')).toThrow();
    expect(() => resourceId.parse('id/child')).toThrow();
  });

  it('prevents key-value record path traversal', () => {
    expect(recordKey.parse('OUTPUT')).toBe('OUTPUT');
    expect(() => recordKey.parse('../OUTPUT')).toThrow();
    expect(() => recordKey.parse('a/b')).toThrow();
  });
});
