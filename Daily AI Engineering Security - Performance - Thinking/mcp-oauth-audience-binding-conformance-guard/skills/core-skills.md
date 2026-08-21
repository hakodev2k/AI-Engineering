# Core Skills

## Skill 1 — Establish MCP OAuth Resource Identity
**Purpose:** turn a deployment URL into one canonical security resource identity used consistently across requests, token issuance, validation, refresh, and tests.

**Trigger:** new remote MCP deployment, OAuth migration, proxy/gateway change, or authorization incident.

**Inputs:** MCP endpoint, protected-resource metadata, authorization-server metadata, expected issuer, expected scopes.

**Preconditions:** HTTPS production endpoint; authorization metadata is available or explicitly configured.

**Required context:** canonical public MCP URL and any reverse-proxy rewrite rules.

**Tools:** HTTP metadata fetcher, configuration diff, `scripts/mcp_oauth_guard.py`.

**Procedure:**
1. Resolve the externally visible MCP endpoint.
2. Normalize scheme/host/path; never silently replace public identity with an internal service URL.
3. Compare the value with RFC 9728 protected-resource metadata.
4. Set one `canonical_resource` in policy.
5. Enumerate sibling resources sharing the same issuer.
6. Generate positive and wrong-audience fixtures.
7. Run conformance tests.

**Decisions:** if metadata disagrees with deployed URL, stop and fix metadata/configuration instead of accepting multiple audiences for convenience.

**Constraints:** do not broaden audience matching to wildcard hosts or issuer-wide acceptance.

**Expected output:** canonical resource, issuer set, scope requirements, sibling negative cases.

**Metrics:** metadata match rate; number of accepted audiences; negative-case rejection rate.

**Verification:** canonical resource is accepted; sibling resource is rejected.

**Failure handling:** record mismatch and fail closed.

**Stop conditions:** resource identity remains ambiguous or ownership cannot be established.

## Skill 2 — Validate Client Resource Binding
**Purpose:** detect MCP clients that authenticate successfully but request tokens without the intended resource binding.

**Trigger:** OAuth client integration, DCR change, refresh-flow change, or repeated 401 after consent.

**Inputs:** sanitized authorization URL/query, token request body, refresh request body, policy.

**Preconditions:** no live client secret is stored in fixtures.

**Required context:** target MCP resource and provider behavior.

**Tools:** request capture, `mcp_oauth_guard.py check-request`.

**Procedure:**
1. Capture authorization request without credentials.
2. Verify target resource binding per deployment policy.
3. Capture token exchange and verify equivalent resource intent.
4. Capture refresh flow and verify it cannot drift to another resource.
5. Decode resulting test token and verify effective audience.
6. Treat a successful browser consent as irrelevant unless the token passes audience verification.

**Decisions:** provider-specific scope-based resource binding may be supported only when an explicit adapter proves the resulting token audience is correct.

**Constraints:** never disable resource-server audience validation to compensate for client incompatibility.

**Expected output:** pass/fail matrix across authorize/token/refresh/result-token stages.

**Metrics:** request-stage conformance; resulting-audience correctness; refresh drift count.

**Verification:** negative fixture missing resource fails; valid fixture succeeds.

**Failure handling:** block rollout; preserve sanitized request evidence.

**Stop conditions:** token audience cannot be determined or provider semantics are undocumented.

## Skill 3 — Verify Resource-Server Audience Enforcement
**Purpose:** ensure the MCP server rejects validly signed tokens intended for sibling services.

**Trigger:** middleware change, IdP migration, new API sharing issuer, penetration test.

**Inputs:** policy and signed/stub test claims.

**Preconditions:** tests run against non-production or local validator.

**Required context:** trusted issuer, canonical audience, expiry and scope rules.

**Tools:** `mcp_oauth_guard.py check-token`, integration test harness.

**Procedure:**
1. Establish baseline with a valid token.
2. Mutate audience to sibling resource while preserving other claims.
3. Verify rejection.
4. Test audience missing, issuer mismatch, expiry, missing scope.
5. Verify server returns 401 for invalid token and 403 for valid token with insufficient authorization where applicable.
6. Record evidence separately from implementation status.

**Expected output:** deterministic acceptance/rejection matrix.

**Metrics:** false accepts, false rejects, negative-case coverage.

**Verification:** zero false accepts across required fixtures.

**Failure handling:** mark security gate failed; do not expand accepted audiences.

**Stop conditions:** any wrong-resource token is accepted.

## Skill 4 — Detect Token Passthrough
**Purpose:** prevent an MCP gateway/server from forwarding the inbound bearer token to downstream APIs.

**Trigger:** proxying tools to third-party/upstream APIs.

**Inputs:** sanitized inbound/outbound authorization fingerprints.

**Preconditions:** compare hashes, never log full secrets.

**Tools:** `mcp_oauth_guard.py compare-token-fingerprints`, trace hooks.

**Procedure:** hash inbound bearer token locally; hash outbound token; fail if equal; verify outbound token audience targets upstream API; repeat on refresh/retry paths.

**Expected output:** passthrough verdict and fingerprints.

**Metrics:** passthrough detections; upstream audience correctness.

**Verification:** synthetic identical-token fixture is blocked.

**Failure handling:** stop request and escalate.

**Stop conditions:** outbound credential provenance cannot be verified.
