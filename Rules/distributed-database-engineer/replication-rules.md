# Replication Rules

## Purpose
Ensure replicas improve availability without obscuring correctness or recovery risks.

## Scope
Leader-based, multi-leader, leaderless, synchronous, and asynchronous replication.

## MUST
- Replication topology MUST document write authority, acknowledgement criteria, lag expectations, and failure behavior.
- Replication lag MUST be observable and tied to consumer correctness requirements.
- Failover MUST define how split-brain and stale-primary writes are prevented or reconciled.
- Replica promotion MUST preserve durability guarantees claimed by the service.

## MUST NOT
- MUST NOT route consistency-sensitive reads to replicas without a bounded-staleness strategy.
- MUST NOT treat replication as backup.
- MUST NOT enable multi-writer replication without explicit conflict semantics.

## SHOULD
- Replication factor and placement SHOULD reflect failure domains and recovery objectives.

## Exceptions
Relaxed durability or stale-read policies require documented business tolerance, monitoring, and approval.

## Verification
Use failover drills, lag dashboards, write-loss tests, topology inspection, and recovery exercises.