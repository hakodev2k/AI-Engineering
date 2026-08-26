import { describe, expect, it, vi } from 'vitest';
import { loadConfig, type Config } from '../src/config.js';
import { approvalDigest, assertApproval, TOOL_POLICY } from '../src/policy.js';
import { assertRecipientsAllowed, assertWebhookAllowed, invoke, schemas } from '../src/tools.js';
import type { Upstream } from '../src/upstream.js';

const config: Config = {
  serverToken: 'server-token',
  defaultSenderEmail: 'sender@example.com',
  defaultMessageStream: 'outbound',
  approvalSecret: '0123456789abcdef0123456789abcdef',
  webhookUrlAllowlist: ['https://hooks.example.com/'],
  recipientDomainAllowlist: ['example.com'],
  timeoutMs: 30000
};

class FakeUpstream implements Upstream {
  callMock = vi.fn(async (name: string, args: Record<string, unknown>) => ({ name, args }));
  call(name: string, args: Record<string, unknown>) { return this.callMock(name, args); }
  async close() {}
}

describe('configuration', () => {
  it('rejects missing credentials', () => expect(() => loadConfig({})).toThrow(/POSTMARK_SERVER_TOKEN/));
  it('loads least-secret configuration from environment variables', () => {
    const value = loadConfig({
      POSTMARK_SERVER_TOKEN: 'x',
      POSTMARK_DEFAULT_SENDER_EMAIL: 'sender@example.com',
      POSTMARK_APPROVAL_SECRET: '0123456789abcdef'
    });
    expect(value.defaultMessageStream).toBe('outbound');
  });
});

describe('validation and policy', () => {
  it('caps outbound search pages', () => expect(() => schemas.emailSearch.parse({ count: 501 })).toThrow());
  it('classifies external sends as high risk', () => expect(TOOL_POLICY['postmark.email.send']).toEqual({ risk: 'HIGH_RISK', approvalRequired: true }));
  it('binds approval to exact arguments', () => {
    const args = { to: 'user@example.com', subject: 'Hello', textBody: 'Body' };
    const token = approvalDigest(config.approvalSecret, 'postmark.email.send', args);
    expect(() => assertApproval(config.approvalSecret, 'postmark.email.send', { ...args, approval: token }, token)).not.toThrow();
    expect(() => assertApproval(config.approvalSecret, 'postmark.email.send', { ...args, subject: 'Changed', approval: token }, token)).toThrow(/Invalid approval/);
  });
  it('rejects non-allowlisted recipient domains', () => expect(() => assertRecipientsAllowed(config, 'user@evil.test')).toThrow(/not allowlisted/));
  it('requires HTTPS and allowlisted webhook URLs', () => {
    expect(() => assertWebhookAllowed(config, 'http://hooks.example.com/a')).toThrow(/HTTPS/);
    expect(() => assertWebhookAllowed(config, 'https://evil.test/a')).toThrow(/not allowlisted/);
  });
});

describe('tool execution', () => {
  it('does not execute a send without approval', async () => {
    const upstream = new FakeUpstream();
    await expect(invoke(upstream, config, 'postmark.email.send', 'sendEmail', { to: 'user@example.com', subject: 'Hi', textBody: 'Body' })).rejects.toThrow(/approval/);
    expect(upstream.callMock).not.toHaveBeenCalled();
  });
  it('removes approval before forwarding to official MCP', async () => {
    const upstream = new FakeUpstream();
    const args = { to: 'user@example.com', subject: 'Hi', textBody: 'Body' };
    const approval = approvalDigest(config.approvalSecret, 'postmark.email.send', args);
    await invoke(upstream, config, 'postmark.email.send', 'sendEmail', { ...args, approval });
    expect(upstream.callMock).toHaveBeenCalledWith('sendEmail', args);
  });
  it('retries transient read failures but never blindly retries writes', async () => {
    const read = new FakeUpstream();
    read.callMock.mockRejectedValueOnce(new Error('429 rate limit')).mockResolvedValueOnce({ ok: true });
    await expect(invoke(read, config, 'postmark.server.get', 'getServerInfo', {})).resolves.toEqual({ ok: true });
    expect(read.callMock).toHaveBeenCalledTimes(2);

    const write = new FakeUpstream();
    write.callMock.mockRejectedValue(new Error('503 temporarily unavailable'));
    const args = { to: 'user@example.com', subject: 'Hi', textBody: 'Body' };
    const approval = approvalDigest(config.approvalSecret, 'postmark.email.send', args);
    await expect(invoke(write, config, 'postmark.email.send', 'sendEmail', { ...args, approval })).rejects.toThrow(/503/);
    expect(write.callMock).toHaveBeenCalledTimes(1);
  });
});
