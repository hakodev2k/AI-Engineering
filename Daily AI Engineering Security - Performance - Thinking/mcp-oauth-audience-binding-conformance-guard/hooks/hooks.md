# Hooks

## Pre-task — Canonical Resource Check
**Trigger:** before any OAuth/MCP integration work.

**Action:** load `config/policy.json`, resolve deployment's externally visible MCP URL, compare to protected-resource metadata.

**Command/script:** `python scripts/mcp_oauth_guard.py check-policy --policy config/policy.json`

**Expected result:** policy is syntactically valid, canonical resource is absolute HTTPS URI, issuer set is non-empty, and fail-closed rules are enabled.

**Failure behavior:** stop; do not continue with token tests using ambiguous identity.

## Pre-auth — Request Binding Check
**Trigger:** after constructing authorization, token, or refresh parameters and before using them in integration tests.

**Action:** verify required resource intent equals policy canonical resource.

**Command/script:** `python scripts/mcp_oauth_guard.py check-request --policy config/policy.json --stage authorize --input fixtures/authorize-valid.json`

**Expected result:** exit 0 only when required resource binding is present and exact.

**Failure behavior:** block OAuth flow test; save sanitized parameter names/value mismatches only.

## Post-token — Claims Gate
**Trigger:** after obtaining or constructing a test access-token claim set.

**Action:** validate issuer, audience, expiry, and scopes against policy.

**Command/script:** `python scripts/mcp_oauth_guard.py check-token --policy config/policy.json --claims fixtures/token-valid.json`

**Expected result:** valid fixture passes; wrong-resource fixture fails.

**Failure behavior:** reject token and stop protected-resource call.

## Pre-upstream — Passthrough Guard
**Trigger:** before an MCP gateway forwards a request to an upstream protected API.

**Action:** compare SHA-256 fingerprints of inbound and outbound bearer values in memory.

**Command/script:** `python scripts/mcp_oauth_guard.py compare-tokens --policy config/policy.json --inbound-env TEST_INBOUND_TOKEN --outbound-env TEST_OUTBOUND_TOKEN`

**Expected result:** fingerprints differ when passthrough is forbidden.

**Failure behavior:** block outbound request. Never print token values.

## CI Final Verification
**Trigger:** auth/proxy/IdP-related pull request or release.

**Action:** run deterministic fixtures and inspect machine-readable summary.

**Command/script:** `python tests/test_guard.py`

**Expected result:** all mandatory positive and negative tests pass.

**Failure behavior:** fail CI; no automatic relaxation of audience/scope rules.
