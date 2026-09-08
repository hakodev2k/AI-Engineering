import test from "node:test";
import assert from "node:assert/strict";
import { tools, toolByName, upstreamAllowlist, upstreamArguments } from "../src/tools.js";
import { RISK } from "../src/policy.js";

test("registers a focused provider-scoped tool surface", () => {
  assert.equal(tools.length, 11);
  assert.equal(new Set(tools.map((t) => t.name)).size, tools.length);
  assert.ok(tools.every((t) => t.name.startsWith("porkbun.")));
  assert.equal(toolByName.get("porkbun.nameserver.update").risk, RISK.HIGH_RISK);
  assert.equal(toolByName.get("porkbun.dns.record.delete").risk, RISK.DESTRUCTIVE);
});

test("only documented official upstream tools are allowlisted", () => {
  for (const name of ["ping","check_domain","get_pricing","list_domains","get_domain","get_nameservers","list_dns_records","create_dns_record","update_dns_record","delete_dns_record","update_nameservers"]) {
    assert.equal(upstreamAllowlist.has(name), true);
  }
  assert.equal(upstreamAllowlist.has("get_ssl_bundle"), false);
  assert.equal(upstreamAllowlist.has("register_domain"), false);
});

test("approval material is never forwarded upstream", () => {
  assert.deepEqual(upstreamArguments({ domain: "example.com", approval_token: "a".repeat(64) }), { domain: "example.com" });
});
