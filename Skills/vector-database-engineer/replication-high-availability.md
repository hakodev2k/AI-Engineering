# Replication and High Availability

## Purpose
Design vector-database availability so node or zone failures do not silently violate retrieval or durability objectives.

## When to use
Use for production architecture, scaling, disaster exercises, or availability incidents.

## Inputs
Availability SLO, RPO/RTO, replication model, topology, consistency semantics, traffic, and failure domains.

## Context to inspect
Inspect replica placement, leader/follower behavior, write acknowledgement, failover, lag, client routing, backups, and quorum rules.

## Core knowledge
Replication improves availability but is not backup. Asynchronous replicas may lose recent writes; synchronous/quorum writes increase latency. Read replicas can serve stale data. Failure-domain diversity matters more than replica count alone.

## Procedure
1. Translate business SLO into RPO/RTO and failure scenarios.
2. Map replicas to independent zones/racks/failure domains.
3. Document write acknowledgement and read consistency.
4. Measure replication lag under normal and peak ingestion.
5. Configure health-aware client routing and bounded timeouts.
6. Test leader/node/zone loss and recovery.
7. Verify index state and metadata consistency after failover.
8. Ensure backups cover corruption/operator-error scenarios.
9. Monitor lag, quorum health, replica availability, and failovers.

## Decision points
Use stronger write acknowledgement when lost updates are unacceptable; accept asynchronous replication when latency/availability trade-offs permit bounded RPO. Serve stale reads only when product semantics tolerate them.

## Common failure patterns
All replicas in one zone; treating replicas as backups; failover never tested; clients pinned to failed endpoints; hidden stale reads; capacity insufficient after replica loss; simultaneous maintenance reducing quorum.

## Verification
Run controlled failover, measure observed RTO/data loss, validate query/write behavior, and restore from backup separately.

## Expected output
An HA topology, consistency policy, failure runbook, monitoring, and tested RPO/RTO evidence.

## Stop conditions
Stop if destructive failure testing lacks approval or topology cannot meet stated durability requirements.