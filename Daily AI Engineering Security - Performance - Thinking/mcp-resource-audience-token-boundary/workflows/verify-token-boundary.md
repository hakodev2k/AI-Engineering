# Workflow — Verify Token Boundary

## Trigger
Auth implementation/change or pre-release security verification.

## Goal
Prove that only tokens intended for this MCP resource reach tool execution and that upstream APIs receive separately issued credentials.

## Inputs
Policy JSON, token metadata fixtures, outbound credential metadata, implementation under test.

## Baseline
Record current valid/invalid fixture behavior and any passthrough path before changing code.

## Stages
1. **Observe** — map inbound auth and outbound Authorization construction.
2. **Measure baseline** — run valid, wrong-audience, expired, missing-scope, and passthrough fixtures.
3. **Diagnose** — identify which invariant fails.
4. **Hypothesize** — choose the smallest boundary correction.
5. **Implement** — change validation/exchange logic; never relax required security.
6. **Measure again** — rerun all fixtures.
7. **Independent verify** — Security Verifier repeats tests and reviews logs.

## Responsible agent
Implementation owner for stages 1–6; `subagents/security-verifier.md` for stage 7.

## Tools
Application test runner and `scripts/token_boundary_check.py`.

## Outputs
Before/after matrix, reason codes, residual risk, approval record when needed.

## Checkpoints
No production write before negative fixtures pass. Human approval is required for identity-provider/client/resource changes.

## Metrics
Negative-fixture block rate, valid pass rate, passthrough-path count, secret leakage count.

## Retry policy
Maximum 2 implementation retries. Every retry must change a hypothesis or implementation detail and rerun the full matrix.

## Stop conditions
Stop on verification success, two failed retries, unknown token provenance, or required human identity decision.

## Failure path
Fail closed, preserve evidence, revert unsafe changes, escalate to identity/security owner.

## Definition of Done
Implemented: boundary checks exist. Measured: full matrix recorded. Verified: independent rerun passes with zero passthrough and zero secret exposure.
