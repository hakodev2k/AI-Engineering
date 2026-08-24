# Skill — Calibrate Effective Context Budget

## Purpose
Produce an evidence-backed compaction budget for one model/runtime combination.

## Trigger
Model/runtime upgrade, token-accounting change, unexplained compaction behavior, or pre-rollout validation for long sessions.

## Inputs
Raw context window, output/provider reserves, request-level observed prompt tokens, runtime-counted tokens, current trigger, representative traces, quality checks.

## Preconditions
Telemetry MUST distinguish compared quantities. Model and runtime versions MUST be recorded. Production rollout SHOULD use at least three representative long-session traces.

## Required context
Provider/model limits, serialization path, compaction implementation, usage-field semantics, and required safety/quality context.

## Allowed tools
Read-only trace/log inspection, tokenizer/provider usage inspection, `scripts/context_budget_calibrator.py`, test runner, benchmark harness.

## Constraints
MUST NOT remove required context to improve metrics. MUST NOT infer provider semantics without evidence. MUST preserve security instructions, approvals, goal state, and verification evidence.

## Procedure
1. Capture baseline tokens/task, compactions/task, overflow recoveries, latency, and quality.
2. Record raw window and each reserve separately.
3. Capture observed serialized prompt occupancy and runtime-counted occupancy at equivalent checkpoints.
4. Run the calibrator for each checkpoint.
5. If accounting error exceeds policy, diagnose before changing the trigger.
6. Form one falsifiable hypothesis: raw-vs-usable denominator, double-counted category, missing reserve, stale metadata, or serialization drift.
7. Implement the smallest correction.
8. Replay the same workload set and compare before/after results.
9. Require independent verification before rollout.

## Decision points
Accounting mismatch blocks threshold tuning. Low headroom requires a lower trigger or larger reserve. Correct accounting with excessive early compaction requires policy tuning backed by quality and overflow evidence. Any quality regression rejects the optimization.

## Expected output
Versioned calibration record with model/runtime identity, input quantities, verdict, metrics, accepted threshold, risks, and verification status.

## Metrics
Accounting error ratio, headroom ratio, compactions/task, overflow recoveries/task, tokens/task, latency/task, quality regression rate.

## Verification
Independent verifier reproduces calculations from raw telemetry and confirms tests and benchmarks.

## Failure handling
Retry incomplete telemetry capture at most twice. Ambiguous semantics stop the workflow and escalate to runtime/provider investigation.

## Stop conditions
Success requires policy-compliant accounting/headroom and no quality/security regression. Stop unsuccessfully on unverifiable telemetry or critical-context loss.
