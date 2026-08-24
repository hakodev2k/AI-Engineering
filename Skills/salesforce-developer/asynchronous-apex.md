# Asynchronous Apex

## Purpose
Choose and implement Queueable, Batch, Scheduled, and future-style asynchronous work with bounded retries, observable failures, and correct transaction semantics.

## When to use
Use for callouts after DML, long-running work, high record volumes, scheduled processing, or decoupling noncritical side effects from synchronous transactions.

## Inputs
Workload size, latency requirement, ordering, callouts, retry policy, state needs, limits.

## Context to inspect
Existing jobs, flex queue usage, chaining, schedulers, integration endpoints, idempotency keys, monitoring.

## Core knowledge
Each async mechanism has different limits and execution semantics. Async boundaries create eventual consistency and require idempotency and operational visibility.

## Procedure
1. Define why synchronous execution is insufficient.
2. Estimate record count and per-unit resource use.
3. Choose Queueable for composable jobs, Batch for very large datasets, Scheduled for time-based initiation.
4. Pass stable identifiers instead of large object graphs.
5. Make external effects idempotent.
6. Bound chaining and retries.
7. Persist failure context where operations can inspect it.
8. Test success, partial failure, retry, and duplicate execution.

## Decision points
Prefer Queueable for most new async orchestration; use Batch when chunked query processing is required. Avoid async merely to hide inefficient code.

## Common failure patterns
Unbounded chaining, duplicate side effects, assuming execution time, lost failures, and async jobs that exceed limits per chunk.

## Verification
Confirm job completion, limit use, duplicate safety, error telemetry, and recovery procedure.

## Expected output
An async design with mechanism rationale, idempotency, retry, monitoring, and tests.

## Stop conditions
Escalate when ordering guarantees or throughput requirements exceed native async capabilities.