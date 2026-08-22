# High Availability and Failover

## Purpose
Design and operate database redundancy so expected infrastructure failures do not become prolonged service outages or silent data loss.

## When to use
Use for HA architecture, failover reviews, topology changes, maintenance planning, and availability incidents.

## Inputs
Availability objectives, RPO/RTO, replication options, regions/zones, latency, consistency requirements, application connection behavior, and failure scenarios.

## Context to inspect
Inspect primary/replica topology, synchronization mode, quorum or election rules, connection strings, DNS/proxy behavior, lag monitoring, and operational ownership.

## Core knowledge
HA is a system property involving database, network, clients, orchestration, and people. Synchronous replication can reduce data loss but increases latency and coupling; asynchronous replication trades possible loss for distance and performance.

## Procedure
1. Define failures the design must survive.
2. Map data-loss and recovery objectives.
3. Choose replication and placement strategy.
4. Define election/failover authority and split-brain protections.
5. Configure application reconnection and transient-failure handling.
6. Monitor replica health, lag, quorum, and storage.
7. Document planned and unplanned failover procedures.
8. Run controlled failover drills.
9. Validate failback and resynchronization.
10. Review observed recovery time against objectives.

## Decision points
Use automatic failover only when fencing, quorum, and client behavior are reliable. Manual failover may be safer for complex cross-region scenarios requiring human validation.

## Common failure patterns
Untested replicas, missing client retry/reconnect behavior, confusing HA with backup, ignoring replication lag, and failover without fencing the old primary.

## Verification
Execute failure drills and confirm write correctness, client recovery, monitoring, and measured RTO/RPO.

## Expected output
A validated HA topology and failover runbook with known trade-offs.

## Stop conditions
Escalate when topology can permit dual writers, recovery objectives cannot be met, or failover testing would create uncontrolled production risk.