import { describe, expect, it } from 'vitest';
import { assertProjectAllowed, assertRepositoryAllowed, loadConfig } from '../src/config.js';
import { approvalDigest, assertApproval, TOOL_RISK } from '../src/policy.js';

const baseEnv = {
  AZURE_DEVOPS_ORGANIZATION: 'contoso',
  AZURE_DEVOPS_AUTH_MODE: 'entra',
  AZURE_DEVOPS_BEARER_TOKEN: 'not-a-real-token'
};

describe('configuration and policy', () => {
  it('requires the credential for the selected auth mode', () => {
    expect(() => loadConfig({ AZURE_DEVOPS_ORGANIZATION: 'contoso', AZURE_DEVOPS_AUTH_MODE: 'entra' })).toThrow(/BEARER_TOKEN/);
    expect(() => loadConfig({ AZURE_DEVOPS_ORGANIZATION: 'contoso', AZURE_DEVOPS_AUTH_MODE: 'pat' })).toThrow(/PAT/);
  });

  it('enforces project and repository allowlists', () => {
    const config = loadConfig({ ...baseEnv, AZURE_DEVOPS_ALLOWED_PROJECTS: 'Alpha', AZURE_DEVOPS_ALLOWED_REPOSITORIES: 'alpha/service-a' });
    expect(() => assertProjectAllowed(config, 'Alpha')).not.toThrow();
    expect(() => assertProjectAllowed(config, 'Beta')).toThrow(/not allowed/);
    expect(() => assertRepositoryAllowed(config, 'Alpha', 'service-a')).not.toThrow();
    expect(() => assertRepositoryAllowed(config, 'Alpha', 'service-b')).toThrow(/not allowed/);
  });

  it('requires a valid HMAC approval for writes and high-risk tools', () => {
    const secret = 'test-secret';
    const tool = 'azure_devops.pipeline.run';
    expect(TOOL_RISK[tool]).toBe('HIGH_RISK');
    expect(() => assertApproval(tool, undefined, secret)).toThrow(/approval/i);
    expect(() => assertApproval(tool, approvalDigest(secret, tool), secret)).not.toThrow();
  });

  it('does not require approval for read tools', () => {
    expect(() => assertApproval('azure_devops.project.list', undefined, undefined)).not.toThrow();
  });
});
