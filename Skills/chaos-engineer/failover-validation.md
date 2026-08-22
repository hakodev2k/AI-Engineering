# Failover Validation

## Purpose
Prove that redundant components actually take over within required recovery objectives and preserve correct service behavior.

## When to use
Use for replicas, availability zones, regions, leaders, databases, gateways, and active/passive systems.

## Inputs
Failover design, RTO/RPO, health checks, routing, replication, and operational runbooks.

## Context to inspect
Review quorum, replication lag, leader election, DNS/routing TTLs, session state, warm-up behavior, and manual dependencies.

## Core knowledge
Redundancy is not resilience until failover is exercised. Validate detection, transition, capacity, correctness, and failback separately.

## Procedure
1. Define expected failover sequence and timing.
2. Verify standby capacity and data state.
3. Establish baseline traffic and replication metrics.
4. Fail one bounded component or domain.
5. Measure detection and routing/election time.
6. Validate requests, writes, sessions, and background work.
7. Restore the failed component.
8. Test controlled failback and reconciliation.

## Decision points
Use automatic failover for predictable recoverable failures; retain controlled manual steps when automation could amplify ambiguous states.

## Common failure patterns
Cold standby capacity, stale health checks, DNS delay, hidden single points, split brain, replication lag surprises, and untested failback.

## Verification
Confirm RTO/RPO, correctness, capacity, and post-recovery state against explicit objectives.

## Expected output
Failover evidence, measured recovery timings, and identified gaps.

## Stop conditions
Stop for data divergence beyond tolerance, quorum risk, or failover outside the approved domain.