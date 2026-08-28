# Data Guard High Availability and Disaster Recovery

## Purpose
Design and operate Oracle Data Guard for controlled replication, failover, switchover, and disaster recovery aligned to RPO/RTO.

## When to use
Use for standby architecture, DR testing, protection-mode changes, lag incidents, or planned role transitions.

## Inputs
RPO/RTO, network characteristics, redo rates, primary/standby topology, licensing/features, failure scenarios.

## Context to inspect
Protection mode, redo transport, standby redo logs, apply mode, broker configuration, lag metrics, archive gaps, flashback, observer/FSFO, and application connection behavior.

## Core knowledge
Data Guard reduces recovery time but does not replace backups. Synchronous protection trades latency for data-loss guarantees; asynchronous transport tolerates distance at nonzero RPO.

## Procedure
1. Define required failure scenarios and tolerated data loss.
2. Choose protection mode from latency and RPO evidence.
3. Validate standby redo sizing and transport configuration.
4. Configure broker and health checks where supported.
5. Monitor transport lag, apply lag, gaps, and destination errors.
6. Design client/service reconnection behavior.
7. Rehearse switchover before relying on failover.
8. Test failover, reinstatement, and flashback prerequisites.
9. Measure achieved recovery time and data exposure.
10. Keep operational runbooks synchronized with topology changes.

## Decision points
Use synchronous transport only when network latency and application SLA permit. Enable automatic failover only with reliable observers, split-brain controls, and tested application behavior.

## Common failure patterns
Untested standby, no standby redo logs, archive gaps unnoticed, failover without client routing, and confusing replication with backup.

## Verification
Execute scheduled role-transition drills and verify data consistency, service recovery, lag, and reinstate procedures.

## Expected output
A tested HA/DR topology and role-transition runbook.

## Stop conditions
Stop when network, application routing, or split-brain controls cannot satisfy the chosen protection mode.