# Write-Behind Caching

## Purpose
Design asynchronous write-behind only where delayed persistence is explicitly acceptable and recoverable.

## When to use
Use for workloads where write latency or batching benefit is material and data-loss/ordering risks are understood.

## Inputs
Durability requirement, write volume, ordering keys, persistence latency, recovery objectives.

## Context to inspect
Inspect cache durability, queueing mechanism, flush policy, crash recovery, deduplication, source constraints, and audit requirements.

## Core knowledge
Write-behind moves persistence off the request path but turns the cache/buffer into temporary system of record. Durability, ordering, replay, backpressure, and reconciliation become mandatory engineering concerns.

## Procedure
1. Confirm delayed persistence is allowed.
2. Define acceptable loss window and RPO/RTO.
3. Partition writes by ordering domain.
4. Persist buffered mutations durably if required.
5. Make downstream writes idempotent.
6. Define batch size, flush interval, and backpressure.
7. Handle poison records and permanent failures.
8. Build replay and reconciliation tooling.
9. Instrument queue depth, oldest age, flush latency, and failure rate.
10. Crash-test before and during flush.

## Decision points
Use write-behind only when latency benefit outweighs consistency and operational complexity. Prefer direct durable writes when loss or delayed visibility is unacceptable.

## Common failure patterns
Using volatile memory for critical writes; no ordering key; silent drops; unbounded queue; retrying permanent errors forever; no reconciliation.

## Verification
Demonstrate recovery after process/node failure and prove persisted state converges without duplicate side effects.

## Expected output
A durable, observable write-behind design with recovery evidence.

## Stop conditions
Stop if business semantics require synchronous durability or recovery cannot be proven.