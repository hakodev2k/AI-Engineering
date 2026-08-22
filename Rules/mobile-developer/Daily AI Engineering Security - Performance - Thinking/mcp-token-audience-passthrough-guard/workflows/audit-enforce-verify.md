# Workflow: Audit → Enforce → Verify

## Trigger
New MCP auth integration, auth-library upgrade, resource URI change, or upstream API credential-path change.

## Goal
Prove that authenticated requests are resource-bound and inbound credentials are not reused across trust boundaries.

## Inputs
Policy, sanitized validated-token metadata, MCP resource URI, scope requirements, outbound host/credential-source map, auth code diff.

## Baseline
Record current fixture results before changing code: valid request, wrong audience, missing audience, wrong issuer, insufficient scope, outbound host violation, token-passthrough attempt.

## Stages
1. **Observe** — map ingress validator and outbound credential path.
2. **Measure baseline** — run the guard against representative sanitized fixtures.
3. **Diagnose** — identify whether failure is issuer, resource, scope, egress host, or credential separation.
4. **Form hypothesis** — state the minimal boundary change expected to fix the failing fixture.
5. **Implement** — change production integration using standard OAuth/JWT libraries; do not implement custom crypto.
6. **Measure again** — rerun all fixtures, not only the originally failing one.
7. **Independent verify** — hand off to `subagents/security-verifier.md`.
8. **Complete** — record Implemented/Measured/Verified separately.

## Responsible agent
Implementation owner for stages 1–6; Security Verifier for stage 7.

## Tools
Repository inspection, standard auth library tests, `scripts/token_boundary_guard.py`, unit/integration tests.

## Outputs
Baseline results, changed boundaries, before/after fixture table, verifier decision, residual risks.

## Checkpoints
- Canonical resource URI confirmed before implementation.
- No raw credential emitted by tests.
- All negative fixtures present before final verification.

## Metrics
100% audience-negative fixtures denied; 100% passthrough fixtures denied; zero raw-token logging; valid-path regression rate 0%.

## Retry policy
At most 3 diagnose/change/retest cycles. Each retry must change the hypothesis or implementation based on new evidence.

## Stop conditions
Stop on unknown resource identity, absent cryptographic validation, production-only unsafe reproduction, or three failed cycles.

## Failure path
Preserve failing evidence, revert unsafe weakening, mark `blocked`, and escalate to a human security owner.

## Verification
Independent verifier executes the full fixture suite and inspects the actual egress credential source.

## Definition of Done
Evidence documented; baseline captured; boundary fix implemented; valid request succeeds; all negative fixtures fail closed; no secrets exposed; verifier returns `verified`; residual risk documented.