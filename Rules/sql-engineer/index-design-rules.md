# Index Design Rules

## Purpose
Use indexes deliberately to improve access paths without creating unacceptable write, storage, or maintenance cost.

## Scope
Row-store indexes, covering strategies, filtered/partial indexes, specialized indexes, and index lifecycle decisions.

## MUST
- New indexes MUST have a defined workload need supported by query and plan evidence.
- Key order and included/projected columns MUST reflect predicates, joins, ordering, selectivity, and engine behavior.
- Index changes MUST assess write amplification, storage, locking, build duration, and maintenance impact.
- Redundant and overlapping indexes MUST be evaluated before adding another index.

## MUST NOT
- MUST NOT create indexes merely because a column appears in a predicate.
- MUST NOT assume an index is beneficial without verifying optimizer use and workload effect.
- MUST NOT drop an index based only on low observed use without checking observation window, special workloads, constraints, and recovery scenarios.

## SHOULD
- Prefer the smallest index that reliably serves the required workload.
- Review index health and value as data distribution and workloads evolve.

## Exceptions
Large or risky production index operations require documented operational windows, rollback/recovery options, and human approval.

## Verification
Compare plans and workload metrics before/after, inspect usage and redundancy, estimate storage/build resources, and test representative reads and writes.