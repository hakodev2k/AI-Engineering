import { describe, expect, it } from 'vitest';
import { loadConfig } from '../src/config.js';
import { ApprovalError, requireApproval } from '../src/permissions.js';

describe('configuration and approval boundaries', () => {
  it('requires provider refresh token', () => {
    expect(() => loadConfig({ SOLARWINDS_IR_REGION: 'us' })).toThrow(/REFRESH_TOKEN/);
  });

  it('rejects unsupported region', () => {
    expect(() => loadConfig({ SOLARWINDS_IR_REGION: 'apac', SOLARWINDS_IR_REFRESH_TOKEN: 'x' })).toThrow(/region/i);
  });

  it('requires explicit write approval and validates it in constant time', () => {
    expect(() => requireApproval(undefined, 'candidate')).toThrow(ApprovalError);
    expect(() => requireApproval('human-secret', undefined)).toThrow(ApprovalError);
    expect(() => requireApproval('human-secret', 'wrong-secret')).toThrow(ApprovalError);
    expect(() => requireApproval('human-secret', 'human-secret')).not.toThrow();
  });
});
