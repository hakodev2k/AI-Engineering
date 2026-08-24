# Governor Limits and Performance

## Purpose
Diagnose and reduce Salesforce resource consumption across SOQL, DML, CPU, heap, callouts, async execution, and serialization.

## When to use
Use for limit exceptions, slow transactions, high-volume features, large payloads, or architecture reviews.

## Inputs
Logs, Limits metrics, transaction type, data volume, queries, automation graph, CPU/heap evidence.

## Context to inspect
Apex, Flow, triggers, managed packages, queries, recursion, serialization, callouts, and async boundaries.

## Core knowledge
Governor limits are transaction-scoped protections in a multi-tenant runtime. Performance work must identify the dominant constrained resource instead of optimizing blindly.

## Procedure
1. Reproduce with realistic volume.
2. Capture query count/rows, DML count/rows, CPU, heap, and callouts.
3. Identify the largest contributors.
4. Remove repeated work and N+1 access.
5. Reduce loaded fields/records and object graph size.
6. Consolidate DML and avoid automation loops.
7. Move appropriate work asynchronously without hiding inefficiency.
8. Retest and compare evidence.

## Decision points
Optimize synchronous work first when latency matters; split transactions when workload inherently exceeds one transaction's budget.

## Common failure patterns
Premature caching, tiny test datasets, optimizing code while Flow dominates CPU, and moving work async without idempotency.

## Verification
Compare before/after resource measurements and confirm behavior under near-worst-case volume.

## Expected output
Measured bottleneck analysis, implemented changes, and remaining resource headroom.

## Stop conditions
Escalate when required workload cannot fit supported platform limits without changing user experience or architecture.