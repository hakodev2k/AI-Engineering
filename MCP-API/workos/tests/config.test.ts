import { describe, expect, it } from 'vitest';
import { loadConfig } from '../src/config.js';

describe('config', () => {
  it('requires a secret API key', () => expect(() => loadConfig({} as NodeJS.ProcessEnv)).toThrow(/WORKOS_API_KEY/));
  it('requires HTTPS API base URLs', () => expect(() => loadConfig({ WORKOS_API_KEY: 'sk_x', WORKOS_API_BASE_URL: 'http://example.com' } as NodeJS.ProcessEnv)).toThrow(/HTTPS/));
  it('loads externally approved fingerprints', () => expect(loadConfig({ WORKOS_API_KEY: 'sk_x', WORKOS_APPROVED_ACTIONS: 'a,b' } as NodeJS.ProcessEnv).approvedActions.has('b')).toBe(true));
});
