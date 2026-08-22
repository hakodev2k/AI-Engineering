import { describe, expect, it, vi } from 'vitest';
import { loadConfig } from '../src/config.js';
import { approvalSignature, assertApproval, assertFromAllowed } from '../src/policy.js';
import { TwilioConnectorClient } from '../src/client.js';

const config = loadConfig({
  TWILIO_ACCOUNT_SID: 'AC11111111111111111111111111111111',
  TWILIO_API_KEY: 'SK22222222222222222222222222222222',
  TWILIO_API_SECRET: '1234567890abcdef1234567890abcdef',
  TWILIO_ALLOWED_FROM_NUMBERS: '+15550000001',
  TWILIO_APPROVAL_SECRET: 'approval-secret-that-is-at-least-32-bytes',
  TWILIO_TIMEOUT_MS: '5000',
  TWILIO_MAX_READ_RETRIES: '2'
});

describe('config and policy', () => {
  it('rejects missing credentials', () => expect(() => loadConfig({})).toThrow('TWILIO_ACCOUNT_SID'));
  it('rejects outbound actions when sender is not allowlisted', () => expect(() => assertFromAllowed('+15550000002', config.allowedFromNumbers)).toThrow('not allowed'));
  it('accepts a fresh action-bound approval token', () => {
    const now = 1_800_000_000_000;
    const target = '+15550000001->+15550000002';
    const sig = approvalSignature('twilio.message.send', target, now, config.approvalSecret);
    expect(() => assertApproval('twilio.message.send', target, `${now}:${sig}`, config.approvalSecret, now)).not.toThrow();
  });
  it('rejects approval reuse for another target', () => {
    const now = 1_800_000_000_000;
    const sig = approvalSignature('twilio.message.send', 'a', now, config.approvalSecret);
    expect(() => assertApproval('twilio.message.send', 'b', `${now}:${sig}`, config.approvalSecret, now)).toThrow('does not match');
  });
});

describe('TwilioConnectorClient', () => {
  it('routes reads to the read client and writes to the write client', async () => {
    const readList = vi.fn().mockResolvedValue([{ sid: 'SM1' }]);
    const writeCreate = vi.fn().mockResolvedValue({ sid: 'SM2' });
    const fakeRead: any = {
      messages: Object.assign(vi.fn(), { list: readList }),
      calls: Object.assign(vi.fn(), { list: vi.fn() }),
      incomingPhoneNumbers: Object.assign(vi.fn(), { list: vi.fn() }),
      api: { v2010: { accounts: vi.fn(() => ({ fetch: vi.fn() })) } }
    };
    const fakeWrite: any = {
      messages: { create: writeCreate },
      calls: { create: vi.fn() }
    };
    const client = new TwilioConnectorClient(config, { readClient: fakeRead, writeClient: fakeWrite });
    await client.messageList(10);
    await client.messageSend({ to: '+15550000002', from: '+15550000001', body: 'hello' });
    expect(readList).toHaveBeenCalledWith({ limit: 10, to: undefined, from: undefined });
    expect(writeCreate).toHaveBeenCalledOnce();
  });
});
