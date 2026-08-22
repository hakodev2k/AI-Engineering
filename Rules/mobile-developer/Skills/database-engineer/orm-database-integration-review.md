# ORM and Database Integration Review

## Purpose
Ensure ORM-generated database behavior preserves performance, correctness, and transaction semantics at production scale.

## When to use
Use for ORM adoption, slow application queries, migration reviews, N+1 problems, unexpected transactions, and database-heavy code reviews.

## Inputs
Application data-access code, generated SQL, mappings, schema, plans, transaction configuration, query telemetry, and workload patterns.

## Context to inspect
Inspect actual generated SQL rather than inferring it from application expressions. Review loading strategy, tracking, batching, pagination, mappings, and connection/transaction lifecycle.

## Core knowledge
ORMs improve developer productivity but do not remove database physics. Abstractions can hide round trips, wide projections, client evaluation, lock duration, and inefficient generated SQL.

## Procedure
1. Identify high-impact application data paths.
2. Capture generated SQL and round-trip counts.
3. Detect N+1 access and unnecessary eager loading.
4. Project only required columns for read paths.
5. Verify predicates remain server-executable and sargable.
6. Review pagination and ordering for stable efficient access.
7. Inspect transaction boundaries and save batching.
8. Validate mappings, keys, concurrency tokens, and cascade behavior.
9. Benchmark generated SQL with representative data.
10. Use explicit SQL or stored routines only where abstraction cost is proven and ownership is clear.

## Decision points
Keep ORM queries when they are understandable and efficient. Bypass the ORM selectively for specialized bulk, reporting, or performance-critical operations rather than abandoning consistency wholesale.

## Common failure patterns
N+1 queries, loading full entities for projections, client-side filtering, unbounded includes, one transaction per row, and blaming the database without inspecting generated SQL.

## Verification
Measure query count, plans, reads, latency, transaction behavior, and integration tests.

## Expected output
A data-access design with efficient generated SQL and explicit exceptions where needed.

## Stop conditions
Escalate when application semantics cannot be inferred safely or proposed changes require ownership decisions across teams.