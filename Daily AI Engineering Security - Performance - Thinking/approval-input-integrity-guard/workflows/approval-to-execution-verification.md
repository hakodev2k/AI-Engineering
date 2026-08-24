# Workflow — Approval to Execution Verification

## Trigger
A tool call enters an approval-required state.

## Goal
Ensure the approved representation is exactly the representation that executes.

## Inputs
Tool call, raw input state, schema, deterministic transforms, approval policy.

## Baseline
Measure current percentage of approval-bearing calls that can prove argument continuity and collect existing mismatch/parse-loss events.

## Context
Treat model output, transport serialization, parser defaults, transforms, delegation wrappers, and UI projection as separate trust transitions.

## Stages
1. **Observe** — capture raw/parsed/validated states without side effects.
2. **Measure baseline** — count ambiguous/defaulted/mutated approval paths.
3. **Diagnose** — identify where identity or arguments can change.
4. **Form hypothesis** — select the smallest canonicalization/binding change.
5. **Implement** — canonicalize final pre-execution arguments and create approval digest.
6. **Measure again** — replay fixtures and production-safe traces.
7. **Verify** — independent reviewer confirms negative and positive tests.

## Responsible agent
Runtime implementer; independent `subagents/approval-security-reviewer.md` verifies.

## Tools
Schema validator, deterministic transform pipeline, `scripts/approval_input_guard.py`, test runner.

## Outputs
Approval envelope, digest, reason-coded audit event, verification report.

## Checkpoints
- parsing is loss-aware;
- transformations complete before approval;
- nested tool identity resolved;
- approval digest stored;
- execution digest recomputed;
- mismatch blocks.

## Metrics
Digest coverage, mismatch count, malformed-input blocks, re-approval count, false-positive rate.

## Retry policy
At most one retry after deterministic normalization. Any subsequent mismatch requires a fresh approval or human escalation.

## Stop conditions
Exact digest match plus valid authorization, or BLOCK on unresolved mismatch/ambiguity.

## Failure path
Preserve sanitized evidence, deny side effect, mark approval invalid, escalate. Never execute with degraded evidence.

## Verification
Positive unchanged-payload case and negative mutation, malformed JSON, missing input, and nested-identity cases all pass expected outcomes.

## Definition of Done
High-impact approval calls have complete digest coverage, mismatch tests block, unchanged tests allow, audit records are sanitized, and independent review passes.
