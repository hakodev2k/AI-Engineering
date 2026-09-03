import { describe, expect, it } from 'vitest';
import { loadConfig } from '../src/config.js';
import { authorize } from '../src/policy.js';

describe('configuration and policy', () => {
  it('requires a valid subdomain and credentials', () => {
    expect(() => loadConfig({} as NodeJS.ProcessEnv)).toThrow(/GORGIAS_SUBDOMAIN/);
    expect(() => loadConfig({ GORGIAS_SUBDOMAIN: 'shop' } as NodeJS.ProcessEnv)).toThrow(/Configure/);
  });

  it('supports OAuth bearer authentication', () => {
    const config = loadConfig({ GORGIAS_SUBDOMAIN: 'shop', GORGIAS_OAUTH_ACCESS_TOKEN: 'token' } as NodeJS.ProcessEnv);
    expect(config.auth.type).toBe('bearer');
  });

  it('supports API key basic authentication', () => {
    const config = loadConfig({ GORGIAS_SUBDOMAIN: 'shop', GORGIAS_API_EMAIL: 'agent@example.com', GORGIAS_API_KEY: 'key' } as NodeJS.ProcessEnv);
    expect(config.auth.type).toBe('basic');
  });

  it('allows reads but gates writes by default', () => {
    const config = loadConfig({ GORGIAS_SUBDOMAIN: 'shop', GORGIAS_OAUTH_ACCESS_TOKEN: 'token' } as NodeJS.ProcessEnv);
    expect(() => authorize(config, 'READ', 'read')).not.toThrow();
    expect(() => authorize(config, 'WRITE', 'write')).toThrow(/approval/i);
    expect(() => authorize(config, 'HIGH_RISK', 'send')).toThrow(/approval/i);
  });

  it('never lets disabling normal write approval bypass HIGH_RISK approval', () => {
    const config = loadConfig({
      GORGIAS_SUBDOMAIN: 'shop', GORGIAS_OAUTH_ACCESS_TOKEN: 'token', GORGIAS_REQUIRE_WRITE_APPROVAL: 'false'
    } as NodeJS.ProcessEnv);
    expect(() => authorize(config, 'WRITE', 'write')).not.toThrow();
    expect(() => authorize(config, 'HIGH_RISK', 'send')).toThrow(/approval/i);
  });
});
