# Partition Layout Rules

## Purpose
Keep physical data layout aligned with correctness, retention, and workload behavior.

## Scope
Warehouse tables, lake files, stream partitions, clustering, and partition pruning.

## MUST
- Select partition keys using measured access patterns, cardinality, skew, retention, and update behavior.
- Validate that time-based partition boundaries preserve required business-time semantics.
- Monitor skew and hotspot formation for critical workloads.
- Document repartitioning impact before production changes.

## MUST NOT
- Select partitioning solely by convention without workload evidence.
- Create partition schemes that cause uncontrolled small-file or metadata overhead.
- Change partition strategy without evaluating historical data rewrite and downstream compatibility.

## SHOULD
- Prefer layouts that enable pruning for dominant queries.
- Reassess layouts periodically against current workload metrics.

## Exceptions
Temporary suboptimal layouts require documented constraints, impact, and remediation criteria.

## Verification
Inspect query plans, scan volumes, partition statistics, skew metrics, file counts, and benchmark results.