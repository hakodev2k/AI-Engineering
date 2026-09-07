# Indexing Rules

## Purpose
Balance query performance against write amplification, storage, and operational cost.

## Scope
Primary, secondary, local, global, covering, inverted, and specialized indexes.

## MUST
- Every material index MUST serve identified access patterns or constraints.
- Index cost MUST include write amplification, storage, replication, rebuild, and maintenance impact.
- Global secondary indexes MUST document consistency and failure semantics.
- Index creation on large production datasets MUST have capacity and rollback plans.

## MUST NOT
- MUST NOT add indexes solely because a query is slow without diagnosing its bottleneck.
- MUST NOT retain unused expensive indexes indefinitely.
- MUST NOT rebuild large indexes during peak load without validated headroom.

## SHOULD
- Index usage SHOULD be periodically measured and stale indexes reviewed.

## Exceptions
Temporary operational indexes require an owner and removal criterion.

## Verification
Use query plans, index-usage statistics, write-latency measurements, storage metrics, and controlled rollout evidence.