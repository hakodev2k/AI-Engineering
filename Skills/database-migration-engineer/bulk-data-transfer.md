# Bulk Data Transfer

## Purpose
Move large baseline datasets efficiently without compromising correctness or destabilizing source and target systems.

## When to use
Use for initial loads, offline migrations, or baseline phases before incremental synchronization.

## Inputs
Data volume, table sizes, transfer tools, network limits, source/target resource budgets, target constraints, and migration window.

## Core knowledge
Throughput depends on extraction parallelism, serialization, compression, network, target ingest, indexes, constraints, logging, and storage. Maximum throughput is not the same as safest throughput.

## Procedure
1. Benchmark a representative slice end to end.
2. Establish source and target resource ceilings.
3. Choose chunk keys that are stable and evenly distributed.
4. Configure bounded parallelism and compression.
5. Define resumable checkpoints.
6. Load parent/child data in a constraint-safe plan or explicitly control constraint timing.
7. Monitor lag, CPU, I/O, locks, logs, and storage growth.
8. Retry only idempotent chunks.
9. Reconcile every completed partition.
10. Record achieved throughput for cutover forecasting.

## Decision points
Increase parallelism only while bottlenecks and production impact remain acceptable. Disable/rebuild indexes only when time saved exceeds recovery and validation risk.

## Common failure patterns
Unbounded parallelism, non-resumable exports, chunk overlap/gaps, source lock pressure, target log exhaustion, and success declared from row counts alone.

## Verification
Validate chunk coverage, counts, checksums or aggregates, error logs, and resource telemetry.

## Expected output
A resumable baseline load with measured throughput and reconciliation evidence.

## Stop conditions
Stop when source health degrades, target durability is threatened, or checkpoint integrity is uncertain.