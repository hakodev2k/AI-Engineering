import { describe, expect, it } from 'vitest';
import { loadConfig, assertOrgAllowed, assertWorkspaceAllowed } from '../src/config.js';
import { assertPermission, expectedApproval } from '../src/policy.js';

describe('config and policy', () => {
  it('requires a token', () => {
    expect(() => loadConfig({})).toThrow(/TFE_TOKEN/);
  });

  it('loads allowlists and bounded settings', () => {
    const c = loadConfig({ TFE_TOKEN: 'x', TERRAFORM_CLOUD_ALLOWED_ORGS: 'acme', TERRAFORM_CLOUD_ALLOWED_WORKSPACES: 'ws-1', TERRAFORM_CLOUD_TIMEOUT_MS: '5000', TERRAFORM_CLOUD_MAX_RETRIES: '2' });
    expect(c.address).toBe('https://app.terraform.io');
    expect(() => assertOrgAllowed(c, 'acme')).not.toThrow();
    expect(() => assertOrgAllowed(c, 'other')).toThrow(/not allowed/);
    expect(() => assertWorkspaceAllowed(c, 'ws-1')).not.toThrow();
  });

  it('denies writes by default', () => {
    const c = loadConfig({ TFE_TOKEN: 'x' });
    expect(() => assertPermission(c, 'terraform_cloud.workspace.create', 'WRITE')).toThrow(/ENABLE_WRITE=false/);
  });

  it('requires approval for writes', () => {
    const c = loadConfig({ TFE_TOKEN: 'x', TERRAFORM_CLOUD_ENABLE_WRITE: 'true', TERRAFORM_CLOUD_APPROVAL_SECRET: 'secret' });
    expect(() => assertPermission(c, 'terraform_cloud.workspace.create', 'WRITE')).toThrow(/approval/);
    const token = expectedApproval('secret', 'terraform_cloud.workspace.create');
    expect(() => assertPermission(c, 'terraform_cloud.workspace.create', 'WRITE', token)).not.toThrow();
  });

  it('requires destructive enablement for apply/delete', () => {
    const c = loadConfig({ TFE_TOKEN: 'x', TERRAFORM_CLOUD_ENABLE_WRITE: 'true', TERRAFORM_CLOUD_APPROVAL_SECRET: 'secret' });
    const token = expectedApproval('secret', 'terraform_cloud.run.apply');
    expect(() => assertPermission(c, 'terraform_cloud.run.apply', 'HIGH_RISK', token)).toThrow(/ENABLE_DESTRUCTIVE=false/);
  });
});
