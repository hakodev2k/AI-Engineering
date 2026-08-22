# Skill: Query and Index Tuning

## Purpose
Reduce workload cost and latency without trading away write performance, correctness, or maintainability blindly.

## Trigger
Latency regression, high CPU/IO, scan amplification, timeout, costly top query, or index review.

## Inputs
Query text/shape, parameters, actual/representative plan, row counts, statistics, waits, runtime metrics, index definitions, write rate.

## Procedure
1. Reproduce or capture comparable evidence; record baseline latency, CPU, reads, rows, waits, and plan.
2. Validate parameter/cardinality behavior and data distribution.
3. Locate dominant operators and amplification: scans, lookups, sorts, spills, bad joins, non-sargable predicates, row-estimation errors.
4. Fix query shape or predicate before adding redundant indexes when practical.
5. For an index candidate, define key order, included columns, selectivity, maintenance/write/storage cost, and overlap.
6. Test under representative parameters and concurrency.
7. Compare before/after evidence and inspect regressions in writes or neighboring queries.
8. Define deployment and rollback/removal criteria.

## Decisions
Prefer the smallest change that attacks measured cost. Do not optimize a single plan while ignoring workload-level trade-offs.

## Outputs
Evidence bundle, root cause, recommendation, expected benefit, side effects, verification result.

## Verification
Equivalent workload/window; plan shape plus runtime metrics; no material integrity or write regression.

## Failure handling
If the result is noisy or plan selection is unstable, label the conclusion inconclusive and gather more evidence.

## Stop condition
Measured goal is met or the next bottleneck is proven outside scope.