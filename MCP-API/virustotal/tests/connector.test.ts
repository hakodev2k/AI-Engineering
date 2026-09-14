import { describe, expect, it } from 'vitest';
import crypto from 'node:crypto';
import { loadConfig } from '../src/config.js';
import { assertSubmissionAllowed, requireSubmissionApproval } from '../src/policy.js';
import { ALLOWED_UPSTREAM_TOOLS } from '../src/upstream.js';

describe('VirusTotal connector security', () => {
  it('requires a credential', () => expect(() => loadConfig({})).toThrow());
  it('rejects an untrusted MCP origin', () => expect(() => loadConfig({ VTAI_TOKEN: 'x', VTAI_MCP_URL: 'https://evil.example/mcp' })).toThrow(/trusted/));
  it('allowlists exactly the supported upstream tools', () => expect([...ALLOWED_UPSTREAM_TOOLS].sort()).toEqual(['get_analysis','get_domain_report','get_file_report','get_ip_report','get_submission','get_url_report','submit_file'].sort()));
  it('denies unapproved submission', () => expect(() => requireSubmissionApproval('virustotal.file.submit', 'a'.repeat(64), undefined, 's'.repeat(32))).toThrow(/approval/));
  it('accepts a valid approval receipt', () => {
    const secret = 's'.repeat(32), digest = 'a'.repeat(64);
    const approval = crypto.createHmac('sha256', secret).update(`virustotal.file.submit:${digest}`).digest('hex');
    expect(() => requireSubmissionApproval('virustotal.file.submit', digest, approval, secret)).not.toThrow();
  });
  it('enforces the optional submission allowlist', () => expect(() => assertSubmissionAllowed('b'.repeat(64), new Set(['a'.repeat(64)]))).toThrow(/allowlist/));
});
