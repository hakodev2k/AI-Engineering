# Distributed Secondary Indexes

## Purpose
Design secondary indexing that supports query requirements without uncontrolled write amplification, inconsistency, or cluster-wide fan-out.

## When to use
Use when adding query dimensions, diagnosing index lag, or redesigning distributed access paths.

## Inputs
Queries, selectivity, update rates, shard key, index consistency guarantees, storage and latency budgets.

## Context to inspect
Schema, query plans, index definitions, partitioning, index build status, write amplification, and repair behavior.

## Core knowledge
Local indexes scale writes but may require fan-out. Global indexes improve targeted reads but introduce distributed maintenance and consistency concerns. Denormalized lookup tables can make index semantics explicit at application level.

## Procedure
1. Rank queries requiring non-primary access.
2. Measure selectivity and result cardinality.
3. Determine acceptable index staleness.
4. Compare local, global, inverted, and materialized lookup approaches.
5. Quantify write and storage amplification.
6. Define index build/backfill strategy.
7. Handle uniqueness separately from lookup acceleration.
8. Test index failure and repair.
9. Monitor lag, size, and query fan-out.

## Decision points
Prefer local indexes when bounded fan-out is acceptable; global indexes when targeted lookup is essential and maintenance semantics meet correctness needs.

## Common failure patterns
Using eventually consistent indexes for uniqueness, indexing low-value columns, unbounded fan-out, blocking index builds, and ignoring tombstone/index cleanup.

## Verification
Compare plans and latency before/after, verify index correctness during concurrent writes, and test rebuild/repair under load.

## Expected output
An index design with consistency assumptions, cost model, rollout plan, and measured query improvement.

## Stop conditions
Stop if query requirements are unclear, the index would exceed capacity, or online construction cannot meet production safety constraints.