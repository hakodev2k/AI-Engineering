import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig, type Config } from "../src/config.js";
import { assertAllowed } from "../src/policy.js";
import { TOOLS, TOOL_MAP } from "../src/tools.js";
import { BraintreeClient, BraintreeConnectorError, type GatewayLike } from "../src/client.js";
import { dispatch } from "../src/server.js";

const config: Config = {
  environment:"sandbox", merchantId:"merchant", publicKey:"public", privateKey:"private",
  timeoutMs:25, maxRetries:2, allowWrites:false, approvalToken:"approval-secret"
};

const fakeGateway = (overrides: Partial<GatewayLike> = {}) => ({
  customer:{ find:async(id:string)=>({id}), create:async(input:Record<string,unknown>)=>({success:true,customer:input}), update:async(id:string,input:Record<string,unknown>)=>({success:true,id,...input}) },
  clientToken:{ generate:async(input:Record<string,unknown>={})=>({clientToken:"redacted-test-token",...input}) },
  transaction:{ find:async(id:string)=>({id}), sale:async(input:Record<string,unknown>)=>({success:true,transaction:{id:"tx",...input}}), refund:async(id:string,amount?:string)=>({success:true,id,amount}), void:async(id:string)=>({success:true,id}) },
  subscription:{ find:async(id:string)=>({id}), cancel:async(id:string)=>({success:true,id}) },
  plan:{ all:async()=>[{id:"plan"}], find:async(id:string)=>({id}) },
  merchantAccount:{ find:async(id:string)=>({id}) },
  ...overrides
}) as GatewayLike;

test("auth configuration requires all Braintree API-key fields", () => {
  assert.throws(() => loadConfig({ BRAINTREE_ENVIRONMENT:"sandbox" }), /required/);
  assert.throws(() => loadConfig({ BRAINTREE_ENVIRONMENT:"sandbox", BRAINTREE_MERCHANT_ID:"m", BRAINTREE_PUBLIC_KEY:"p", BRAINTREE_PRIVATE_KEY:"s", BRAINTREE_MAX_RETRIES:"9" }), /between 0 and 5/);
  const loaded = loadConfig({ BRAINTREE_ENVIRONMENT:"production", BRAINTREE_MERCHANT_ID:"m", BRAINTREE_PUBLIC_KEY:"p", BRAINTREE_PRIVATE_KEY:"s", BRAINTREE_MAX_RETRIES:"3" });
  assert.equal(loaded.environment, "production");
  assert.equal(loaded.maxRetries, 3);
});

test("tool registration is unique and contains meaningful coverage", () => {
  assert.ok(TOOLS.length >= 8);
  assert.equal(new Set(TOOLS.map(t => t.name)).size, TOOLS.length);
  assert.ok(TOOL_MAP.has("braintree.transaction.sale"));
  assert.ok(TOOL_MAP.has("braintree.subscription.cancel"));
});

test("strict schema rejects ambiguous unknown properties", () => {
  assert.throws(() => TOOL_MAP.get("braintree.transaction.get")!.schema.parse({ transactionId:"tx", url:"https://evil.invalid" }));
});

test("writes are denied by default and require the exact approval token", () => {
  assert.throws(() => assertAllowed("WRITE", "braintree.customer.update", { approvalToken:"approval-secret" }, config), /ALLOW_WRITES/);
  const enabled = { ...config, allowWrites:true };
  assert.throws(() => assertAllowed("HIGH_RISK", "braintree.transaction.refund", { approvalToken:"wrong-token" }, enabled), /human approval/);
  assert.doesNotThrow(() => assertAllowed("HIGH_RISK", "braintree.transaction.refund", { approvalToken:"approval-secret" }, enabled));
});

test("read calls retry bounded transient failures", async () => {
  const client = new BraintreeClient(config, fakeGateway());
  let attempts = 0;
  const value = await client.call(async () => {
    attempts++;
    if (attempts < 3) throw Object.assign(new Error("network socket failure"), { status:503 });
    return "ok";
  });
  assert.equal(value, "ok");
  assert.equal(attempts, 3);
});

test("non-retryable writes execute once", async () => {
  const client = new BraintreeClient(config, fakeGateway());
  let attempts = 0;
  await assert.rejects(client.call(async () => { attempts++; throw new Error("network failure"); }, { retryable:false }), BraintreeConnectorError);
  assert.equal(attempts, 1);
});

test("timeouts are mapped without live credentials", async () => {
  const short = { ...config, timeoutMs:5, maxRetries:0 };
  const client = new BraintreeClient(short, fakeGateway());
  await assert.rejects(client.call(() => new Promise(resolve => setTimeout(() => resolve("late"), 50))), /timed out/);
});

test("money movement dispatch uses nonce rather than raw card data", async () => {
  let captured: Record<string,unknown> | undefined;
  const gateway = fakeGateway({ transaction:{
    find:async(id:string)=>({id}),
    sale:async(input:Record<string,unknown>)=>{ captured=input; return {success:true}; },
    refund:async(id:string,amount?:string)=>({success:true,id,amount}),
    void:async(id:string)=>({success:true,id})
  }});
  const client = new BraintreeClient(config, gateway);
  await dispatch(client, "braintree.transaction.sale", { amount:"10.00", paymentMethodNonce:"fake-valid-nonce", submitForSettlement:false });
  assert.equal(captured?.paymentMethodNonce, "fake-valid-nonce");
  assert.equal("creditCard" in (captured ?? {}), false);
});
