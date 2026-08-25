# Skill: Phase Latency Investigation

## Purpose
Turn a vague slow-agent report into an attributable, reproducible performance finding.

## Trigger
High total runtime, slow first useful action, platform/provider regression, or unexplained latency after tools complete.

## Inputs
Phase event traces, workload definition, runtime/provider/model/version metadata, correctness result.

## Preconditions
Use the same workload for baseline and comparison. Capture at least five runs when practical and distinguish cold from warm runs.

## Required context
Queue, preparation, provider startup, model/tool loop, business-action, visible-output, and terminal boundaries.

## Allowed tools
Read logs, run `scripts/phase_latency.py`, benchmark runner, statistics tooling.

## Constraints
Do not optimize before baseline measurement. Do not collect secrets/prompts merely for timing. Use monotonic clocks for same-process durations.

## Procedure
1. Define phase schema and workload.
2. Capture baseline traces.
3. Validate traces for missing or overlapping boundaries.
4. Rank phases by median and p95 contribution.
5. Form one hypothesis for the dominant controllable phase.
6. Change one relevant mechanism.
7. Repeat the same runs.
8. Compare phase and total metrics.
9. Verify output/task correctness.
10. Hand evidence to Benchmark Verifier.

## Decision points
If provider inference dominates, do not claim host optimization. If unattributed time exceeds 5%, improve instrumentation before tuning. If only cold runs regress, isolate startup rather than changing steady-state paths.

## Expected output
Baseline, dominant phase, hypothesis, intervention, before/after table, correctness status, residual risks.

## Metrics
Phase p50/p95, TTFA/TTFBA/TTFVO, total p50/p95, unattributed ratio.

## Verification
Improvement must reproduce on repeated comparable runs and the targeted phase must explain the total change.

## Failure handling
Maximum two optimization hypotheses. If both fail, revert and escalate with traces.

## Stop conditions
Stop when evidence is insufficient, instrumentation overhead is material, or the target phase is outside team control.