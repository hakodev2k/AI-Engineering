# Workflow: Integrate and Verify

## Trigger
New/changed OAuth protection on an MCP server, auth-provider migration, upstream API integration, or security regression.

## Goal
Prove the MCP server rejects valid-but-wrong-resource tokens and never forwards inbound tokens downstream.

## Inputs
Server resource URI, trusted issuers, required scopes, existing middleware, downstream auth design.

## Baseline
Before change, run fixtures for: correct audience, wrong audience with valid issuer/signature, missing audience, missing scope, passthrough mode. Record which reach tool dispatch.

## Stages
1. **Observe** — map client→MCP→upstream trust boundaries.
2. **Measure baseline** — record fixture outcomes.
3. **Diagnose** — locate missing audience/resource and passthrough checks.
4. **Hypothesis** — explicit resource binding plus separate downstream credentials blocks the path.
5. **Implement** — configure policy and pre-tool hook.
6. **Measure again** — rerun identical fixtures.
7. **Verify** — independent Security Verifier checks middleware order and results.

## Responsible agent
Integrator implements; `security-verifier` independently verifies.

## Tools
Production JWT verifier, `scripts/audience_guard.py`, unit/integration test framework.

## Outputs
Before/after matrix, sanitized reason codes, verification status.

## Checkpoints
Do not deploy if wrong-audience request reaches a tool. Do not deploy if any inbound token is reused as an upstream bearer credential.

## Metrics
100% required negative rejection; 100% valid fixture pass; 0 passthrough; 0 raw-token logs.

## Retry policy
At most 2 implementation/test iterations. Deterministic auth failures are not retried as requests.

## Failure path
Restore previous secure configuration, disable affected protected tools if necessary, preserve evidence, escalate to identity/security owner.

## Stop conditions
Stop if resource identifier is ambiguous, authorization server behavior cannot be verified, or fix would require weakening signature/issuer/TLS checks.

## Definition of Done
Baseline recorded; guard implemented; all negative fixtures blocked pre-dispatch; valid fixture passes; downstream credential separation proven; independent verification complete.