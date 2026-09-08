import test from "node:test";
import assert from "node:assert/strict";
import { buildServer } from "../src/server/server.js";

test("registers the documented connector tool surface", () => {
  const built = buildServer({
    REVENUECAT_API_V2_KEY: "secret_test_key",
    REVENUECAT_APPROVAL_TOKEN: "human-approved",
  });

  assert.deepEqual(built.tools, [
    "revenuecat.project.list",
    "revenuecat.app.list",
    "revenuecat.product.list",
    "revenuecat.product.get",
    "revenuecat.entitlement.list",
    "revenuecat.offering.list",
    "revenuecat.customer.search",
    "revenuecat.customer.get",
    "revenuecat.customer.subscription.list",
    "revenuecat.customer.entitlement.grant",
    "revenuecat.subscription.get",
    "revenuecat.subscription.cancel",
    "revenuecat.subscription.transaction.refund",
    "revenuecat.analytics.overview",
    "revenuecat.webhook.list",
  ]);
  assert.equal(new Set(built.tools).size, built.tools.length);
});
