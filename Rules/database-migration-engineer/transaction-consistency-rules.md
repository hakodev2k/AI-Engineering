# Transaction Consistency

## Purpose
Preserve transactional correctness while data is moved or transformed.

## Scope
Covers transaction boundaries, snapshots, isolation, write ordering, and cross-system consistency.

## MUST
- Migration design MUST identify transactions whose atomicity or ordering can be broken by migration.
- Snapshot or export mechanisms MUST provide a consistency level compatible with stated invariants.
- Cross-system writes MUST define how partial success is detected and repaired.

## MUST NOT
- MUST NOT assume separately exported tables represent one consistent point in time unless the mechanism guarantees it.
- MUST NOT weaken isolation in production solely to accelerate migration without measured risk and approval.

## SHOULD
- Minimize transaction duration and lock footprint while retaining required correctness.
- Use immutable sequence or change positions to reason about ordering where available.

## Exceptions
Relaxed consistency requires documented business tolerance, bounded anomaly analysis, and validation.

## Verification
Review isolation settings, snapshot semantics, concurrency tests, transaction logs, failure injection, and reconciliation.