import test from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig, type XeroConfig } from '../src/config.js';
import {
  ContactCreateSchema,
  InvoiceCreateSchema,
  READ_TOOL_MAP,
  executeContactCreate,
  executeInvoiceCreate,
  executeRead
} from '../src/server.js';
import type { XeroUpstream } from '../src/upstream.js';

class FakeUpstream implements XeroUpstream {
  calls: Array<{ name: string; args: Record<string, unknown> }> = [];
  async call(name: string, args: Record<string, unknown> = {}): Promise<unknown> {
    this.calls.push({ name, args });
    return { ok: true, name, args };
  }
  async close(): Promise<void> {}
}

const denied: XeroConfig = { bearerToken: 'test-token', writeAllowed: false };
const allowed: XeroConfig = { bearerToken: 'test-token', writeAllowed: true };

test('auth configuration requires bearer token or client credentials', () => {
  assert.throws(() => loadConfig({}), /AUTH_CONFIG_ERROR/);
  assert.equal(loadConfig({ XERO_CLIENT_BEARER_TOKEN: 'abc' }).bearerToken, 'abc');
  const cfg = loadConfig({ XERO_CLIENT_ID: 'id', XERO_CLIENT_SECRET: 'secret' });
  assert.equal(cfg.clientId, 'id');
  assert.equal(cfg.clientSecret, 'secret');
});

test('read tool allowlist is stable and maps to official Xero MCP commands', async () => {
  assert.equal(Object.keys(READ_TOOL_MAP).length, 8);
  const fake = new FakeUpstream();
  await executeRead('xero.invoice.list', fake);
  assert.deepEqual(fake.calls[0], { name: 'list-invoices', args: {} });
});

test('write tools are denied without out-of-band approval', async () => {
  const fake = new FakeUpstream();
  await assert.rejects(
    executeContactCreate({ name: 'Example Ltd' }, fake, denied),
    /APPROVAL_REQUIRED/
  );
  assert.equal(fake.calls.length, 0);
});

test('contact validation rejects malformed email before upstream call', async () => {
  const fake = new FakeUpstream();
  await assert.rejects(
    executeContactCreate({ name: 'Example', email: 'not-an-email' }, fake, allowed)
  );
  assert.equal(fake.calls.length, 0);
  assert.equal(ContactCreateSchema.safeParse({ name: '' }).success, false);
});

test('approved contact create uses the official MCP create-contact command', async () => {
  const fake = new FakeUpstream();
  await executeContactCreate({ name: 'Example Ltd', email: 'ops@example.test' }, fake, allowed);
  assert.equal(fake.calls[0]?.name, 'create-contact');
});

test('invoice schema enforces UUID, bounded lines and date format', () => {
  assert.equal(InvoiceCreateSchema.safeParse({ contactId: 'bad', lineItems: [], type: 'ACCREC' }).success, false);
});

test('approved draft invoice maps to official MCP create-invoice command', async () => {
  const fake = new FakeUpstream();
  await executeInvoiceCreate({
    contactId: '123e4567-e89b-12d3-a456-426614174000',
    type: 'ACCREC',
    date: '2026-08-23',
    lineItems: [{
      description: 'Consulting',
      quantity: 1,
      unitAmount: 100,
      accountCode: '200',
      taxType: 'OUTPUT'
    }]
  }, fake, allowed);
  assert.equal(fake.calls[0]?.name, 'create-invoice');
});
