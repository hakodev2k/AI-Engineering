# Workflow: Audit and Harden MCP OAuth Binding

## Trigger
New MCP authorization integration, protocol migration, IdP/resource migration, security review, or credential-mix-up symptom.

## Goal
Establish explicit issuer/resource provenance and block credential reuse across trust boundaries.

## Inputs
Authorization code paths, metadata endpoints, credential schema, policy, representative redacted traces.

## Baseline
Record current binding coverage, number of legacy credentials without provenance, negative-fixture pass/block behavior, and protected-call validation checks.

## Context
Follow `rules/oauth-binding-rules.md` and use `skills/authorization-boundary-audit.md`.

## Stages
1. **Observe** — map current OAuth transaction and credential lifecycle.
2. **Measure baseline** — run current negative fixtures without changing security configuration.
3. **Diagnose** — identify the earliest point where issuer/resource provenance is lost or not checked.
4. **Form hypothesis** — state the exact missing binding and predicted blocked attack path.
5. **Implement** — add provenance capture, comparison, invalidation, and token checks.
6. **Measure again** — rerun allow and negative fixtures.
7. **Independent verify** — hand off to `subagents/security-verifier.md`.
8. **Complete or re-evaluate** — if blocked, perform at most one further remediation cycle.

## Responsible agents
Implementation owner for stages 1–6; independent OAuth Security Verifier for stage 7.

## Tools
Repository inspection, unit/integration tests, metadata inspection, and `scripts/validate_oauth_binding.py`.

## Outputs
Baseline, root-cause statement, implementation evidence, before/after fixture matrix, verifier decision.

## Checkpoints
- Expected issuer/resource captured before authorization.
- Callback cannot redeem a code after issuer mismatch.
- Credentials invalidate when issuer relationship changes.
- Protected calls enforce issuer plus audience/resource.
- No secrets appear in evidence.

## Metrics
Binding coverage %, negative attack fixtures blocked %, legacy credentials requiring migration, verifier coverage %, secret-leak count.

## Retry policy
Maximum two total implementation/test cycles. A repeated failure with the same root cause stops automatic remediation.

## Stop conditions
Stop on unknown issuer/resource relationship, production IdP change requiring approval, persistent verification failure, or any discovered secret exposure until remediated.

## Failure path
Preserve evidence, invalidate unsafe cached authorization state where safe, prevent protected execution, and escalate to a human security/identity owner.

## Verification
Independent verifier must produce `Verified`. Implemented and measured changes are not considered verified without this handoff.

## Definition of Done
Evidence documented; baseline captured; root cause identified; implementation complete; all negative fixtures blocked; positive fixture passes; protected token checks enforced; no secrets exposed; independent verification passes; no blocking unknown remains.