# Multi-Region Design

## Purpose
Design geographically distributed systems with explicit latency, availability, data residency, consistency, routing, and disaster-recovery trade-offs.

## When to use
Use when requirements demand regional resilience, global latency reduction, jurisdictional placement, or disaster recovery beyond one region.

## Inputs
User geography, RPO/RTO, residency rules, consistency needs, write patterns, network latency, cost, and platform capabilities.

## Context to inspect
Inspect DNS/global routing, identity, databases, replication, queues, object storage, secrets, deployment pipelines, and dependency regionality.

## Core knowledge
Multi-region increases failure modes and coordination cost. Active-active writes require conflict/consistency design; active-passive simplifies write authority but changes failover RTO and capacity needs.

## Procedure
1. Define why multiple regions are required.
2. Map users, data classes, and residency constraints.
3. Define regional failure assumptions and RPO/RTO.
4. Choose traffic routing and health criteria.
5. Choose active-active, active-passive, or hybrid per workload.
6. Define data replication and write authority.
7. Plan conflict handling and failover/failback.
8. Ensure dependencies and secrets are regionally survivable.
9. Provision failover capacity and automate repeatable deployment.
10. Exercise region-loss scenarios and measure recovery.

## Decision points
Do not choose active-active writes solely for availability if business invariants require expensive global coordination. Prefer simpler failover when objectives can be met.

## Common failure patterns
Global frontend with single-region database, untested DNS failover, insufficient passive capacity, hidden regional dependencies, and no failback procedure.

## Verification
Run region-isolation exercises, measure RTO/RPO, verify data correctness, routing, dependency availability, and failback.

## Expected output
A multi-region topology with explicit guarantees, routing, data strategy, and tested recovery.

## Stop conditions
Escalate when residency or recovery requirements conflict with platform capabilities or budget.