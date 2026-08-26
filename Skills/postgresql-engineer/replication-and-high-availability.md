# Replication and High Availability

## Purpose
Design PostgreSQL replication and failover behavior that meets availability and data-loss objectives.

## When to use
Use for HA architecture, replica lag, failover planning, read replicas, or topology changes.

## Inputs
RPO/RTO, topology, workload, network characteristics, failover tooling, replication metrics.

## Context to inspect
Streaming replication, slots, WAL retention, synchronous settings, timelines, client routing, fencing and backup dependencies.

## Core knowledge
Physical streaming replication is asynchronous by default; synchronous replication trades commit latency/availability for stronger durability. Failover requires promotion, routing, split-brain prevention and old-primary handling.

## Procedure
1. Define failure scenarios and recovery objectives.
2. Measure WAL generation and network capacity.
3. Configure replicas and retention safely.
4. Choose sync/async policy deliberately.
5. Monitor byte/time lag and replay state.
6. Define promotion authority and fencing.
7. Automate client rerouting where appropriate.
8. Rehearse failover and failback.
9. Validate backup/PITR after topology changes.
10. Document degraded modes.

## Decision points
Use synchronous replicas only where durability warrants latency/availability trade-offs. Use replicas for reads only with explicit staleness semantics.

## Common failure patterns
Unbounded replication slots, assuming replica reads are current, automated promotion without fencing, no failback plan.

## Verification
Run failure drills; measure data loss, recovery time, routing behavior and replica consistency.

## Expected output
HA topology, failover runbook, monitoring and tested recovery evidence.

## Stop conditions
Escalate if split-brain risk, data-loss policy, or promotion authority is unresolved.