# Workflow: Measure, Compact, Verify

**Trigger:** runtime considers automatic context compaction.  
**Goal:** compact only when justified by a valid current-context measurement and preserve critical state.

## Inputs
Window size, snapshot tokens and provenance, cumulative usage, last-call usage, critical-state ledger.

## Baseline
Record current context utilization, latency, cost estimate, critical-state fields and previous compaction count.

## Stages
1. Observe all token counters and label provenance.
2. Measure baseline utilization from snapshot only.
3. Diagnose inconsistencies against last-call input/cache evidence.
4. Form hypothesis: compaction is necessary because current snapshot exceeds threshold.
5. Run guard.
6. If allowed, compact once while preserving critical-state ledger.
7. Measure tokens and latency again.
8. Compare critical-state coverage pre/post.
9. If utilization did not improve or state was lost, revert/stop and re-evaluate once.
10. Independent Context Verifier reviews result.

## Checkpoints
Before guard, before compaction, immediately after compaction, before continuation.

## Metrics
Snapshot utilization, cumulative usage, tokens removed, latency delta, retained-state coverage, regression rate.

## Retry policy
Maximum 2 measurements and one compaction retry only after a corrected implementation/state source.

## Stop conditions
Unknown provenance, inconsistent snapshot after two measurements, any required-state loss, or no measurable token reduction.

## Failure path
Disable automatic compaction for the session and retain full context until a safe manual/runtime decision is available.

## Verification
Independent Context Verifier must pass trigger provenance and 100% required-state coverage.

## Definition of Done
Valid trigger, measurable reduction, no critical context loss, bounded retries, independent pass.
