# Skill: Token Snapshot Integrity Analysis

## Purpose
Determine whether an agent's compaction trigger is based on a fresh live-context measurement rather than cumulative usage, stale state, or a mismatched capacity.

## Trigger
Use before automatic compaction is enabled, after context-budget configuration changes, or when compaction occurs unexpectedly early/repeatedly.

## Inputs
Current prompt token count, cumulative usage, configured/effective capacities, reserve, turn identity, snapshot source, compaction threshold, relevant runtime logs.

## Preconditions
Token fields and their producers are identifiable. If their semantics are unknown, treat them as untrusted until traced.

## Required context
Only token-accounting code paths, compaction configuration, and representative traces.

## Allowed tools
Read-only code/log inspection, provider usage telemetry, `scripts/compaction_snapshot_guard.py`, unit tests.

## Constraints
- MUST keep cumulative billing usage separate from live prompt occupancy.
- MUST NOT lower reserve or discard required context to make a bad accounting state pass.
- MUST record the source and turn identity of every snapshot used for a decision.

## Procedure
1. Enumerate every token counter and define its unit and scope.
2. Trace the producer of the compaction-control counter.
3. Capture one known-small and one near-threshold prompt snapshot.
4. Compare configured capacity with the effective precheck capacity.
5. Run the deterministic guard on both snapshots.
6. Form a single falsifiable hypothesis for each violation.
7. Correct the accounting path, then re-measure with the same fixtures.
8. Independently verify that compaction fires from live utilization and not cumulative usage.

## Decision points
- Unknown/stale source → block automatic compaction.
- Capacity mismatch beyond policy → block and reconcile configuration.
- Fresh live utilization below threshold → defer.
- Fresh live utilization at/above threshold → allow compaction.

## Expected output
Facts, counter definitions, evidence, violated invariants, root cause, before/after measurements, and verification status.

## Metrics
Premature compaction rate, snapshot age, compactions/100 turns, utilization at trigger, tokens/task, latency/task, quality regressions.

## Verification
A reviewer separate from the implementation owner reproduces both a defer and an allow decision from known fixtures.

## Failure handling
Preserve the trace, disable automatic compaction for the affected accounting path if safe, and escalate if the live token source cannot be identified.

## Stop conditions
Maximum two hypothesis revisions. Stop immediately if continued execution risks state loss or repeated destructive compaction.
