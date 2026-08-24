# Replication Rules

## Purpose
Use replication deliberately for availability and durability while controlling consistency and failure risk.

## Scope
Synchronous, asynchronous, local, cross-zone, and cross-region replication.

## MUST
- Replication topology MUST map replicas to explicit failure domains.
- Consistency, acknowledgement, quorum, and data-loss semantics MUST be understood before production use.
- Replication lag, health, and repair backlog MUST be observable.
- Planned topology changes MUST assess quorum and availability during transition.

## MUST NOT
- MUST NOT reduce replica count or quorum safety in production without approved risk handling.
- MUST NOT assume asynchronous replication meets zero-data-loss requirements.
- MUST NOT place all replicas behind a shared dependency that defeats intended isolation.

## SHOULD
- Test node, zone, link, and replica-loss scenarios under representative load.

## Exceptions
Temporary reduced redundancy requires bounded duration, monitoring, mitigation, and accountable approval.

## Verification
Inspect topology, placement, quorum settings, lag metrics, fault tests, and change records.