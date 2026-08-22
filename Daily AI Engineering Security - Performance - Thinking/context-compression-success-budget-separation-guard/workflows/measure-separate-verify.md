# Workflow: Measure, Separate, Verify Compression Budgets

## Trigger
Long-running agent turns terminate after successful compactions, repeatedly retry failed compaction, or show ambiguous shared counter behavior.

## Goal
Separate productive maintenance from failure/retry budgeting while retaining hard anti-thrash bounds.

## Inputs
Compression telemetry, model results, error IDs, pressure measurements, current counter/reset implementation, configured limits.

## Baseline
Measure at least: terminal failures, maintenance successes, reactive retries, no-progress attempts, model calls/tokens spent on compression, recovery success, and time-to-recovery on a fixed workload.

## Context
Use redacted event metadata rather than full conversation content whenever possible.

## Stages
1. **Observe** — capture representative long-session and failure traces.
2. **Measure baseline** — run the same fixtures under current semantics.
3. **Diagnose** — reconstruct which counter each event consumes and every reset point.
4. **Form hypothesis** — predict how separating verified maintenance success, failure streak, and reactive retry budgets changes outcomes.
5. **Implement** — add explicit state/counters without removing the absolute cap.
6. **Measure again** — replay identical fixtures.
7. **Improved?** — if no, revise the hypothesis once; maximum 2 implementation cycles total.
8. **Independent verification** — benchmark reviewer checks productive and pathological fixtures.
9. **Complete** — record Implemented, Measured, Verified separately.

## Responsible agent
Performance investigator for stages 1–7; independent benchmark reviewer for stage 8.

## Tools
Runtime telemetry, unit tests, controlled benchmark fixtures, `scripts/compression_budget_guard.py`.

## Outputs
Baseline table, state-transition diagnosis, implementation evidence, before/after metrics, verification decision.

## Checkpoints
- Measurement method unchanged between baseline and comparison.
- Successful maintenance is not credited until post-compression continuation is verified.
- No-progress and reactive paths remain bounded.
- Absolute event cap still exists.

## Metrics
Recovery rate, false terminal failures, compression-related model calls/tokens, reactive retry count, no-progress stop latency, maintenance cycles sustained.

## Retry policy
Maximum 2 diagnose/implement/benchmark cycles. Each retry must state new evidence and a changed hypothesis or implementation.

## Stop conditions
Success: target metrics improve with all bounds preserved and tests passing. Failure: two cycles show no improvement, measurements are unreliable, or safety requires removing a hard bound.

## Failure path
Keep current bounded behavior, emit the measured limitation, and hand off the session earlier rather than enabling unlimited retries.

## Verification
Run `python -m unittest tests/test_compression_budget_guard.py`, then replay the host-specific benchmark workload.

## Definition of Done
Evidence documented; baseline captured; counter semantics explicit; implementation complete; tests pass; before/after comparison complete; no unbounded path introduced; independent review passes; no blocking regression remains.
