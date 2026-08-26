# Configuration Tuning

## Purpose
Tune PostgreSQL configuration from workload evidence while avoiding cargo-cult parameter changes.

## When to use
Use after sizing changes, workload shifts, performance investigations, or configuration reviews.

## Inputs
Server resources, workload metrics, query plans, concurrency, durability requirements, PostgreSQL version.

## Context to inspect
Current settings/source, OS/container limits, connection count, memory usage, checkpoints, WAL, IO latency and autovacuum.

## Core knowledge
Settings interact. shared_buffers, work_mem, maintenance_work_mem, effective_cache_size, WAL/checkpoint controls, autovacuum and parallelism must reflect aggregate concurrency and hardware, not isolated formulas.

## Procedure
1. Define measured bottleneck or objective.
2. Capture current settings and baseline metrics.
3. Check host/container constraints.
4. Estimate aggregate memory under concurrency.
5. Change only parameters tied to evidence.
6. Prefer session-level experiments where safe.
7. Load-test representative workload.
8. Observe secondary effects such as WAL, IO and latency tails.
9. Roll out gradually.
10. Record rationale and rollback values.

## Decision points
Tune SQL/schema before global configuration when the problem is workload-specific. Increase work_mem cautiously because it applies per operation, not per server.

## Common failure patterns
Copying internet configs, overallocating memory, huge checkpoints, disabling durability, changing many variables simultaneously.

## Verification
Compare before/after throughput, latency percentiles, resource usage, errors and restart/reload behavior.

## Expected output
Targeted configuration diff, rationale, benchmark and rollback plan.

## Stop conditions
Escalate if change weakens durability/security or requires restart without an approved maintenance path.