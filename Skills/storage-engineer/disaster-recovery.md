# Storage Disaster Recovery

## Purpose
Engineer storage recovery across site, region, or platform failures with explicit consistency, failover, and failback behavior.

## When to use
Use for business-continuity design, regional resilience, DR exercises, or critical-service onboarding.

## Inputs
Business impact, RPO/RTO, topology, replication modes, dependency graph, data consistency requirements, network capacity, and recovery authority.

## Preconditions
Define disaster scenarios and distinguish HA from DR.

## Context to inspect
Replication state, witness/quorum, DNS/routing, identity, keys, backup systems, application ordering, runbooks, and prior exercises.

## Core knowledge
Synchronous replication trades distance/latency for low RPO; asynchronous replication tolerates distance but can lose recent writes. Failback is a separate high-risk operation requiring reconciliation.

## Procedure
1. Define credible disaster scenarios.
2. Map data and application dependencies.
3. Select replication/recovery mechanisms per dataset.
4. Define consistency groups where needed.
5. Establish failover authority and fencing.
6. Document recovery order.
7. Automate state checks and promotion where safe.
8. Test isolated failover.
9. Validate application correctness and RPO/RTO.
10. Test controlled failback and data reconciliation.
11. Record gaps and owners.

## Decision points
Automate predictable checks; retain explicit approval for destructive or split-brain-sensitive promotions. Prefer synchronous replication only when latency and failure-domain separation permit it.

## Common failure patterns
No fencing, stale runbooks, dependencies unavailable at DR site, untested failback, replication lag hidden until disaster, and assuming backup equals DR.

## Verification
Run scheduled DR exercises with measured RPO/RTO, integrity checks, application validation, and documented failback.

## Expected output
A tested DR architecture and runbook with scenarios, authority, ordering, recovery evidence, and residual risks.

## Stop conditions
Stop if fencing cannot prevent dual writers, recovery would destroy the only good copy, or authority to declare/promote DR is absent.
