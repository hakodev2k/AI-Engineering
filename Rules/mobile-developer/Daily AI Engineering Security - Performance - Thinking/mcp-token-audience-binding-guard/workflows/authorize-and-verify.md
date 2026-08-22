# Workflow: Authorize and Verify

## Trigger
New/changed MCP OAuth integration, protected-tool rollout, auth-library update, or an audience/issuer validation finding.

## Goal
Enforce a fail-closed resource-specific authorization boundary before protected tool execution.

## Inputs
Canonical MCP resource, issuer allowlist, operation/scope map, non-secret token metadata, downstream resource map, security fixtures.

## Baseline
Record current validation behavior for valid token metadata plus wrong audience, wrong issuer, missing active state, missing scope, passthrough, and secret-field cases.

## Stages
1. **Observe** — identify current auth path and trust boundaries.
2. **Measure baseline** — execute adversarial fixtures and record which paths are accepted.
3. **Diagnose** — find missing/optional audience, issuer, active, scope, or downstream credential checks.
4. **Form hypothesis** — state one boundary defect and expected blocked fixture.
5. **Implement** — configure explicit resource/issuer/scope policy and separate downstream credentials.
6. **Measure again** — rerun all fixtures through `scripts/token_binding_guard.py` and application security tests.
7. **Verify** — independent reviewer checks policy, logs, and denied paths.
8. **Complete** — record Implemented/Measured/Verified status.

## Responsible roles
Application/security implementer plus a separate security verifier for high-impact authorization changes.

## Tools
OAuth/MCP metadata, guard script, identity-provider test environment, existing integration/security tests.

## Outputs
Policy, attack-fixture results, remediation evidence, residual risks, approval record if required.

## Checkpoints
Before policy change; after deterministic fixtures; after integration tests; after independent review.

## Metrics
Protected-action validation coverage, attack paths denied, secrets exposed, missing-claim fail-closed coverage, least-privilege scope coverage.

## Retry policy
Maximum two remediation attempts per root cause. Each retry must preserve all previous passing security boundaries.

## Stop conditions
Stop on secret exposure, ambiguous canonical resource, unavailable trusted issuer metadata, any attack fixture still allowed, or two failed remediations.

## Failure path
Disable/contain the affected protected integration or keep it read-only where that is an already-approved safe mode. Do not bypass audience/issuer checks. Escalate with captured non-secret evidence.

## Verification
All adversarial fixtures deny, valid fixture allows, application integration tests pass, no raw credentials appear in logs, and independent review passes.

## Definition of Done
Evidence documented; explicit resource and issuer configured; operation scopes mapped; passthrough prohibited; fixtures pass; downstream credentials are separate; verifier signs off; no blocking issue remains.
