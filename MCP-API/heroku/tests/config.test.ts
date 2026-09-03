import { describe, expect, it } from 'vitest';
import { loadConfig } from '../src/config.js';

describe('config', () => {
  it('requires HEROKU_API_KEY', () => expect(() => loadConfig({} as NodeJS.ProcessEnv)).toThrow(/HEROKU_API_KEY/));
  it('parses bounded reliability and approval settings', () => {
    const c = loadConfig({ HEROKU_API_KEY: 'x', HEROKU_MAX_RETRIES: '3', HEROKU_APPROVED_ACTIONS: 'a,b' } as NodeJS.ProcessEnv);
    expect(c.maxRetries).toBe(3);
    expect(c.approvedActions.has('b')).toBe(true);
  });
});
