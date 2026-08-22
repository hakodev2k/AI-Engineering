# Skill: Authorization Transaction Binding

## Purpose
Build and verify one-time OAuth transaction bindings for MCP clients and proxies so consent, client identity, redirect target, issuer, protected resource, scopes, PKCE, and browser session cannot silently drift between authorization request and callback.

## Trigger
Use when implementing or reviewing an MCP OAuth authorization flow, especially for desktop/CLI clients using loopback redirects or MCP proxies forwarding to upstream identity providers.

## Inputs
- Client identifier and metadata document/content.
- Exact redirect URI.
- Authorization-server issuer.
- Protected resource URI.
- Requested scopes.
- PKCE method/challenge.
- State value.
- Browser/session correlation value.
- Consent result.
- Policy from `config/policy.json`.

## Preconditions
The authorization server and protected resource are already discovered according to MCP/OAuth metadata rules. Sensitive values must be available only ephemerally; persistent records store hashes rather than raw state/session/challenge values.

## Required context
MCP 2026-07-28 authorization security considerations, application deployment mode, allowed callback forms, upstream authorization-server behavior, and whether device/platform attestation is available.

## Allowed tools
Repository inspection, OAuth metadata retrieval over validated HTTPS, deterministic validator `scripts/consent_binding_guard.py`, unit tests, and security logs that do not expose credentials or authorization codes.

## Constraints
- MUST NOT log raw authorization codes, access tokens, refresh tokens, state values, browser cookies, or PKCE verifiers.
- MUST NOT weaken exact redirect, issuer, resource, or state checks to make a failing integration pass.
- MUST treat loopback identity separately from domain metadata identity.
- MUST require human approval before relaxing production security policy.

## Procedure
1. Classify the redirect URI as loopback or non-loopback.
2. Validate scheme/hostname policy before creating any transaction.
3. Resolve the authoritative issuer and protected resource.
4. Require PKCE S256 when policy mandates it.
5. Capture the exact scopes and redirect URI rather than normalized approximations that can broaden authority.
6. Hash client metadata, state, PKCE challenge, and browser-session correlation value.
7. Create a short-lived single-use transaction record with an unpredictable transaction ID.
8. For loopback callbacks, require explicit loopback consent and optional attestation according to policy.
9. On callback, compare every binding against the stored record.
10. Atomically consume the transaction before forwarding a code or exchanging it for tokens.
11. Record only non-secret audit evidence: transaction ID, timestamps, decision, mismatch classes, client ID, issuer, resource, and redirect classification.
12. Run replay, redirect-substitution, issuer/resource mix-up, changed metadata, state mismatch, and expired-record tests.

## Decision points
- Missing PKCE S256: deny.
- Loopback without explicit consent: require approval.
- Loopback when attestation is required but absent: deny.
- Any issuer/resource/redirect/state/client-metadata mismatch: deny.
- Reused or expired transaction: deny.
- All required bindings match: allow exactly once.

## Expected output
A machine-readable transaction record and callback decision with deterministic reasons suitable for audit and regression testing.

## Metrics
Binding coverage, callback rejection rate by mismatch reason, replay rejection rate, number of loopback approvals, transaction expiry rate, and security-test pass rate.

## Verification
A verifier independent from the implementation change runs `tests/test_consent_binding_guard.py`, inspects logs for secret leakage, and confirms no forwarding/token exchange happens before successful validation.

## Failure handling
Capture the failed binding class and transaction ID, invalidate the transaction, preserve sanitized evidence, and stop. Retry only a newly initiated authorization flow; never replay the same callback.

## Stop conditions
Stop after one successful validation/consumption or immediately on a blocking mismatch. No automatic retry loop is permitted for security failures.