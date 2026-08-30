# Replication and Topology

## Purpose
Define replication architectures that meet availability, locality, and consistency requirements.

## Scope
Primary-replica, multi-primary, quorum, geo-replication, read replicas, and replication routing.

## MUST
- Replication topology MUST state expected consistency, replication lag tolerance, failover behavior, and write authority.
- Read routing MUST account for stale-read risk.
- Replica count and placement MUST align with failure-domain requirements.
- Topology changes MUST evaluate data-loss risk, replication backlog, and recovery behavior.

## MUST NOT
- MUST NOT treat asynchronous replicas as immediately consistent.
- MUST NOT route correctness-critical reads to lagging replicas without an explicit freshness guarantee.
- MUST NOT assume multi-region placement automatically provides disaster recovery.

## SHOULD
- Prefer topology that minimizes operational complexity while meeting resilience objectives.
- Replication health SHOULD be visible through lag, error, and apply-rate metrics.

## Exceptions
Exceptions require documented SLA impact, compensating controls, and approval.

## Verification
Inspect topology configuration, lag metrics, failover tests, read-routing behavior, and recovery exercises.