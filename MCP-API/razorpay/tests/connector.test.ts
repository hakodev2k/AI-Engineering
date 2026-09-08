import test from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig, enforce, TOOL_RISK } from '../src/config.js';
import { RazorpayClient, RazorpayError } from '../src/client.js';

test('auth configuration requires key id and secret and derives merchant token', () => {
  const c = loadConfig({ RAZORPAY_KEY_ID: 'rzp_test_x', RAZORPAY_KEY_SECRET: 'secret', RAZORPAY_TIMEOUT_MS: '2000' });
  assert.equal(c.merchantToken, Buffer.from('rzp_test_x:secret').toString('base64'));
  assert.equal(c.requireWriteApproval, true);
  assert.throws(() => loadConfig({ RAZORPAY_KEY_ID: 'x' }), /required/);
});

test('permission policy blocks high-risk and configurable write actions without approval', () => {
  assert.equal(TOOL_RISK['razorpay.refund.create'], 'HIGH_RISK');
  assert.throws(() => enforce('razorpay.refund.create', false, true), /approval/);
  assert.throws(() => enforce('razorpay.order.create', undefined, true), /approval/);
  assert.doesNotThrow(() => enforce('razorpay.order.create', undefined, false));
  assert.doesNotThrow(() => enforce('razorpay.payment.get', undefined, true));
});

test('REST client sends isolated Basic credentials and returns JSON', async () => {
  const original = globalThis.fetch;
  let auth = '';
  globalThis.fetch = (async (_input: URL | RequestInfo, init?: RequestInit) => {
    auth = String((init?.headers as Record<string,string>).Authorization);
    return new Response(JSON.stringify({ id: 'pay_123' }), { status: 200, headers: { 'content-type': 'application/json' } });
  }) as typeof fetch;
  try {
    const c = new RazorpayClient(loadConfig({ RAZORPAY_KEY_ID: 'id', RAZORPAY_KEY_SECRET: 'secret' }));
    const out = await c.rest('GET','/payments/pay_123');
    assert.deepEqual(out, { id: 'pay_123' });
    assert.equal(auth, `Basic ${Buffer.from('id:secret').toString('base64')}`);
  } finally { globalThis.fetch = original; }
});

test('REST client preserves 429 retry-after and does not retry unsafe POST', async () => {
  const original = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = (async () => { calls++; return new Response(JSON.stringify({ error: { description: 'rate limited' } }), { status: 429, headers: { 'retry-after': '7' } }); }) as typeof fetch;
  try {
    const c = new RazorpayClient(loadConfig({ RAZORPAY_KEY_ID: 'id', RAZORPAY_KEY_SECRET: 'secret' }));
    await assert.rejects(() => c.rest('POST','/payments/pay_1/refund',{body:{amount:100}}), (e: unknown) => e instanceof RazorpayError && e.status === 429 && e.retryAfter === 7);
    assert.equal(calls, 1);
  } finally { globalThis.fetch = original; }
});

test('timeout configuration is bounded', () => {
  assert.throws(() => loadConfig({ RAZORPAY_KEY_ID: 'id', RAZORPAY_KEY_SECRET: 'secret', RAZORPAY_TIMEOUT_MS: '10' }), /1000/);
  assert.throws(() => loadConfig({ RAZORPAY_KEY_ID: 'id', RAZORPAY_KEY_SECRET: 'secret', RAZORPAY_TIMEOUT_MS: '999999' }), /120000/);
});
