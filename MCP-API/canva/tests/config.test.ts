import { describe, expect, it } from 'vitest';
import { loadConfig } from '../src/config.js';

describe('loadConfig', () => {
  it('requires an access token or complete refresh credentials', () => {
    expect(() => loadConfig({} as NodeJS.ProcessEnv)).toThrow(/CANVA_ACCESS_TOKEN/);
  });

  it('accepts a direct access token and parses approval actions', () => {
    const config = loadConfig({ CANVA_ACCESS_TOKEN: 'token', CANVA_APPROVED_ACTIONS: 'a,b' } as NodeJS.ProcessEnv);
    expect(config.accessToken).toBe('token');
    expect(config.approvedActions.has('b')).toBe(true);
  });

  it('accepts OAuth refresh credentials without a direct access token', () => {
    const config = loadConfig({ CANVA_REFRESH_TOKEN: 'r', CANVA_CLIENT_ID: 'id', CANVA_CLIENT_SECRET: 'secret' } as NodeJS.ProcessEnv);
    expect(config.refreshToken).toBe('r');
  });
});
