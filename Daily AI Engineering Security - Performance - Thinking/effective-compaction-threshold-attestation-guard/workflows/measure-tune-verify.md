# Workflow — Measure, Tune, Verify Effective Compaction

## Trigger
Token/cost/latency regression, session initialization, or compaction-policy change.

## Goal
Align the actual compaction trigger with an explicit token budget while preserving correctness and quality.

## Inputs
Configured policy, effective runtime context/threshold, session telemetry, provider limits, quality checks.

## Baseline
Capture tokens/task, p50/p95 model latency, compactions/session, rate-limit errors, effective threshold tokens/ratio, and task-quality pass rate.

## Context
Separate static configuration, resolved runtime policy, provider/runtime context limits, and observed session behavior.

## Stages
1. **Observe** — collect configured and effective values.
2. **Measure baseline** — record token/latency/quality metrics.
3. **Diagnose** — identify silent clamps, metadata fallback, ratio-only oversizing, or provider mismatch.
4. **Form hypothesis** — choose a bounded policy adjustment.
5. **Implement improvement** — expose/attest effective threshold and optional absolute ceiling.
6. **Measure again** — run comparable workload.
7. **Improved?** If no, re-evaluate once; if yes, continue.
8. **Verify** — independent verifier checks effective state and quality.

## Responsible agent
Token/platform implementer; `subagents/token-budget-verifier.md` performs independent verification.

## Tools
Runtime status/config readers, telemetry, `scripts/attest_compaction_threshold.py`, benchmark/test runner.

## Outputs
Attestation JSON, before/after metrics, policy decision, verification status.

## Checkpoints
Effective context measured; effective threshold measured; divergence reason-coded; baseline saved; policy change bounded; post-change metrics collected; quality checked.

## Metrics
Tokens/task, p50/p95 latency, threshold tokens/ratio, compactions/session, 429 rate, quality regression rate.

## Retry policy
Maximum one tuning retry per run. Further changes require new evidence or human review.

## Stop conditions
Verified improvement with no critical quality regression, or stop after one unsuccessful retry with evidence preserved.

## Failure path
Revert the unverified tuning change, retain attestation/metrics, escalate. Never hide failure by shrinking required context.

## Verification
Configured/effective state is reproducible and measurable; savings are based on observed tokens/latency rather than configuration alone.

## Definition of Done
Baseline and post-change metrics exist, effective policy is attested, divergence is explained, limits are enforced, quality passes, and independent verification succeeds.
