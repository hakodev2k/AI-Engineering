# Workflow: Baseline → Attribute → Regress

## Trigger
Memory pressure incident or candidate runtime build.

## Goal
Find the process family responsible and verify improvement quantitatively.

## Baseline
Run a fixed workload/soak and collect full process-tree samples.

## Stages
1. Observe architecture and choose root PID.
2. Measure baseline trace.
3. Measure candidate trace under comparable conditions.
4. Diagnose root vs descendant growth and top contributors.
5. Form a bounded subsystem hypothesis.
6. Implement one targeted change outside this workflow.
7. Measure again.
8. Independent reviewer verifies delta and threshold status.

## Checkpoints
Trace validation; baseline summary; candidate attribution; post-fix comparison.

## Metrics
Tree peak/growth/slope, root/child growth, descendant count, contributor peaks, candidate-baseline delta.

## Retry policy
At most two repeat soaks when noise or incomplete telemetry prevents conclusion.

## Stop conditions
Verified pass/improvement, reproducible regression with attribution, or escalation after two inconclusive repeats.

## Failure path
Preserve traces and mark result inconclusive; never hide failure by raising memory thresholds.

## Definition of Done
Comparable baseline/candidate; full lineage; regression decision; attributed contributor; post-change measurement when implemented; reviewer PASS.
