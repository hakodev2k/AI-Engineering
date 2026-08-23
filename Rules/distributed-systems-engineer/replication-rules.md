# Replication Rules

## Purpose
Keep replicated state correct, recoverable, and operationally understandable.

## Scope
Primary-replica, multi-leader, quorum, log replication, and replicated caches.

## MUST
- Replication topology MUST define failure tolerance, promotion behavior, and data-loss bounds.
- Replica lag MUST be observable when it can affect correctness or user experience.
- Failover procedures MUST preserve committed-data guarantees.

## MUST NOT
- MUST NOT promote a replica without validating its freshness and role eligibility.
- MUST NOT assume replication equals backup.

## SHOULD
- Replication tests SHOULD cover node loss, network delay, split brain, and rejoin behavior.

## Exceptions
Reduced redundancy requires explicit risk acceptance and restoration plan.

## Verification
Inspect topology, lag metrics, failover tests, recovery evidence, and replication configuration.