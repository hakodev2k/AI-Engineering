# Multi-Region Architecture

## Purpose
Design distributed database deployments across regions while balancing latency, residency, availability, and consistency.

## When to use
Use for global expansion, regional failover, data-residency requirements, or multi-region performance redesign.

## Inputs
User geography, data residency rules, RPO/RTO, latency SLOs, traffic model, consistency requirements, network costs.

## Context to inspect
Region topology, routing, replication, write ownership, failover automation, DNS/load balancing, and compliance constraints.

## Core knowledge
Distance creates unavoidable coordination latency. Active-active improves locality but complicates conflict handling. Active-passive simplifies write ordering but increases remote latency and failover complexity. Residency applies to replicas, backups, logs, and telemetry, not only primary records.

## Procedure
1. Classify data by residency and consistency requirements.
2. Map user reads and writes by region.
3. Define region-loss behavior.
4. Select write ownership per data class.
5. Model cross-region commit latency.
6. Define replication and conflict semantics.
7. Design traffic routing and failover.
8. Validate backup and telemetry residency.
9. Run regional isolation and recovery tests.
10. Document normal and degraded modes.

## Decision points
Choose active-active for locality when conflicts can be prevented or deterministically resolved. Choose active-passive when a single write order is more important than local-write latency.

## Common failure patterns
Unplanned split brain, automatic failback without reconciliation, hidden cross-region dependencies, violating residency through backups, and assuming WAN latency is stable.

## Verification
Measure regional latency, isolate a region, verify accepted writes and recovery, and reconcile data after connectivity returns.

## Expected output
A regional topology, write-routing policy, failure matrix, residency controls, and tested failover procedure.

## Stop conditions
Escalate when legal residency rules are unclear, region-loss semantics are undefined, or failover can create conflicting authoritative histories.