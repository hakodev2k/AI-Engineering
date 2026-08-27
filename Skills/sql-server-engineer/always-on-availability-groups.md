# Always On Availability Groups

## Purpose
Design, operate, and troubleshoot SQL Server Availability Groups for required availability and recovery objectives.

## When to use
Use for HA/DR design, replica health issues, failover planning, or read-scale routing.

## Inputs
RPO/RTO, topology, network characteristics, workload, replica configuration, cluster health, log rates.

## Context to inspect
Inspect synchronization state, send/redo queues, commit mode, quorum, listener/DNS, backups, routing, endpoint security, and failover mode.

## Core knowledge
Synchronous commit reduces data-loss exposure but adds commit-path latency. An AG does not replace backups and does not automatically protect against logical corruption.

## Procedure
1. Define failure domains and recovery objectives.
2. Choose replica placement and commit modes.
3. Validate cluster quorum and network paths.
4. Configure listener and connection behavior.
5. Establish backup preference deliberately.
6. Monitor send/redo queues and synchronization health.
7. Test planned and unplanned failovers.
8. Validate application reconnection and jobs on the new primary.
9. Document failback criteria.

## Decision points
Use synchronous replicas where latency permits and low RPO is required; asynchronous replicas across higher-latency DR links. Automatic failover requires synchronized synchronous partners and operational readiness.

## Common failure patterns
Assuming zero data loss across async replicas, missing jobs/logins on failover targets, fragile DNS assumptions, and never testing application reconnection.

## Verification
Execute controlled failover drills and verify recovery objectives, data state, listener connectivity, jobs, backups, and monitoring.

## Expected output
Topology rationale, failover runbook, health thresholds, and drill evidence.

## Stop conditions
Stop failover when quorum, replica synchronization, or application readiness is uncertain outside an approved incident.