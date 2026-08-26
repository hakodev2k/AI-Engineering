# MVCC and Vacuum Operations

## Purpose
Control dead tuples, transaction-ID risk, visibility, and table/index bloat through evidence-based vacuum management.

## When to use
Use for bloat, autovacuum lag, wraparound warnings, poor index-only scans, or write-heavy tables.

## Inputs
Table statistics, vacuum logs, autovacuum settings, transaction ages, workload patterns.

## Context to inspect
Dead/live tuples, relfrozenxid age, long transactions, update/delete rates, table size, storage headroom.

## Core knowledge
MVCC retains obsolete tuple versions until vacuum can reclaim them. Long-lived snapshots delay cleanup. Autovacuum thresholds, scale factors and freeze behavior must fit table size and churn.

## Procedure
1. Identify high-churn and high-age relations.
2. Check long-running/idle transactions and replication slots.
3. Review autovacuum frequency and duration.
4. Determine whether cleanup is blocked or merely underprovisioned.
5. Tune per-table thresholds/costs where justified.
6. Run manual VACUUM safely when needed.
7. Reserve VACUUM FULL/rewrite operations for planned maintenance.
8. Measure bloat and visibility improvement.
9. Monitor freeze age.
10. Record sustainable settings.

## Decision points
Prefer ordinary/autovacuum cleanup over table rewrites. Lower scale factors on very large high-churn tables.

## Common failure patterns
Disabling autovacuum, treating VACUUM FULL as routine, ignoring old snapshots, confusing dead tuples with reclaimable filesystem space.

## Verification
Confirm tuple cleanup, freeze-age safety, improved visibility and stable maintenance cadence.

## Expected output
Diagnosis, tuning changes, maintenance action, monitoring thresholds.

## Stop conditions
Escalate for wraparound emergency, insufficient disk, or rewrite requiring downtime.