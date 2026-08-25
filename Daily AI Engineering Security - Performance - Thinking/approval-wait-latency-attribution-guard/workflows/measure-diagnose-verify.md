# Workflow: Measure, Diagnose, Verify

## Trigger
A performance claim or optimization involves approval-gated agent tools.

## Goal
Produce a causal latency decision using lifecycle-specific evidence.

## Inputs
Raw runtime trace, target tool, baseline workload.

## Baseline
Capture unmodified end-to-end and lifecycle events before changing instrumentation or code.

## Context
Record runtime version, approval policy, tool version, workload identity, and environment.

## Stages
1. **Observe** — collect raw trace and existing claim. Owner: investigator.
2. **Measure baseline** — run validator. Owner: investigator.
3. **Diagnose** — separate approval, execution, postprocess; list assumptions. Owner: investigator.
4. **Hypothesize** — name the component expected to improve and metric threshold.
5. **Implement** — instrument missing boundaries or apply the scoped optimization.
6. **Measure again** — same workload and approval policy.
7. **Decision checkpoint** — improvement must appear in execution-only metric when the claim is about tool speed.
8. **Independent verification** — Timing Verifier reruns validator/tests.

## Tools
`scripts/attribution_guard.py`, test runner, native runtime telemetry.

## Outputs
Baseline, post-change metrics, decision record, verification status.

## Checkpoints
No implementation before baseline; no speed conclusion with unknown execution duration; no completion before independent verification.

## Metrics
Execution p50/p95 when sample size permits, approval wait, wall time, attributable-tool ratio.

## Retry policy
At most two retries for missing/invalid lifecycle instrumentation. Optimization itself gets at most two bounded iterations.

## Stop conditions
Verified improvement, disproven hypothesis, or retry budget exhausted.

## Failure path
Preserve evidence, classify execution latency unknown, revert speculative optimization if it was justified only by invalid timing, and escalate instrumentation gap.

## Verification
Run hook and independent verifier.

## Definition of Done
Comparable before/after evidence, rules satisfied, tests pass, decision supported, verification status `verified`.