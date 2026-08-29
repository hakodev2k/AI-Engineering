# DynamoDB Data Modeling

## Purpose
Design DynamoDB tables and access patterns for predictable performance, correctness, and cost at scale.

## When to use
Use when building DynamoDB-backed services, fixing hot partitions, adding access patterns, or reducing scan-heavy workloads.

## Inputs
Entities, access patterns, cardinality, request rates, item sizes, consistency needs, transactional boundaries, retention.

## Context to inspect
Partition/sort keys, GSIs/LSIs, capacity mode, streams, TTL, conditional writes, throttling metrics, item collection sizes.

## Core knowledge
DynamoDB design starts from access patterns, not normalized entities. Partition-key distribution is critical. GSIs have independent write/read costs and eventual-consistency behavior. Conditional writes support concurrency control.

## Procedure
1. Enumerate required reads/writes with key conditions.
2. Estimate cardinality and request distribution.
3. Choose partition keys that spread load.
4. Use sort keys to model hierarchy/range queries.
5. Add indexes only for justified access patterns.
6. Model atomic updates with transactions or conditional expressions as needed.
7. Define idempotency and retry behavior.
8. Configure TTL only for data truly safe to expire asynchronously.
9. Load-test skew and burst scenarios.
10. Monitor throttling, latency, and consumed capacity.

## Decision points
Use single-table patterns only when they materially improve access efficiency and team maintainability remains acceptable. Choose on-demand for uncertain traffic; provisioned for predictable workloads where tuning benefits cost.

## Common failure patterns
Scans in request paths, low-cardinality partition keys, unbounded item growth, blindly adding GSIs, and assuming transactions are free.

## Verification
Replay representative access patterns, test hot-key scenarios, validate conditional-write behavior, and compare cost estimates to observed capacity.

## Expected output
Key/index schema, access-pattern map, capacity strategy, and test evidence.

## Stop conditions
Escalate when required query patterns conflict fundamentally with DynamoDB capabilities or consistency requirements are unclear.