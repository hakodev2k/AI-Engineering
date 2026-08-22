# Skill — OAuth Flow Review

## Purpose
Review an MCP OAuth client/proxy/server flow for transaction, consent, redirect, PKCE, and authorization-URL integrity.

## Trigger
New OAuth integration, OAuth callback bug, MCP authentication change, security advisory, or pre-release security review.

## Inputs
Flow diagram/code paths, discovery metadata, redirect URIs, client-registration behavior, state storage, PKCE fields, consent UI behavior, callback listener lifecycle, policy file, and sanitized traces.

## Preconditions
Use test accounts and fake credentials. Identify which component is MCP client, MCP server/proxy, upstream authorization server, browser, and downstream client.

## Required context
Trust boundaries, exact redirect rules, state lifecycle, storage/session mechanism, requested scopes/resource, PKCE method, URL-opening mechanism, and loopback listener ownership.

## Allowed tools
Source search/read, deterministic validator, local test server, HTTP capture with fake tokens, unit/integration tests, dependency/advisory lookup.

## Constraints
Do not expose real codes/tokens/cookies. Do not weaken OAuth security controls to make a provider work. Do not infer consent from upstream provider behavior.

## Procedure
1. Draw the transaction sequence from downstream client consent through upstream callback and final downstream redirect.
2. Record Facts, Assumptions, Evidence, and unknowns; do not infer hidden reasoning.
3. Verify when `state` is generated and persisted. It must be persisted only after explicit downstream consent.
4. Verify transaction state binds client ID, exact redirect URI, resource/scopes, PKCE challenge, browser/session identity, timestamps, and consumed status.
5. Verify the callback rejects mismatch/replay before token exchange or downstream authorization-code issuance.
6. Inspect authorization endpoint metadata handling; reject dangerous schemes and shell-based URL launching.
7. For loopback flows, confirm listener readiness before browser launch and one transaction owns the callback.
8. Run adversarial fixtures through `scripts/oauth_transaction_guard.py`.
9. Compare baseline failures with the post-change result.
10. Hand high-risk changes to `subagents/security-verifier.md` for independent verification.

## Decision points
- Missing browser-bound consent: block release.
- Valid state but wrong client/session/redirect: deny transaction.
- Provider does not support required PKCE: refuse authorization.
- Unsafe authorization URL scheme: deny before browser launch.
- Loopback listener unavailable: stop before authorization.

## Expected output
A sanitized review report with observed facts, attack paths, affected transitions, implemented controls, test evidence, residual risks, and verification status.

## Metrics
Adversarial fixture pass rate, replay block rate, exact-binding coverage, safe URL-launch coverage, loopback readiness coverage, and number of OAuth transitions without explicit validation.

## Verification
At least one legitimate end-to-end flow succeeds; all adversarial fixtures fail for the expected reason; no secret appears in logs; independent verifier signs off.

## Failure handling
Capture the failing fixture and exact transition, change one hypothesis/control per retry, maximum two remediation cycles, then disable/constrain the affected OAuth path and escalate.

## Stop conditions
Stop when all required bindings are deterministic and verified, or immediately when real credential exposure is detected, required context is unavailable, or two remediation attempts fail.
