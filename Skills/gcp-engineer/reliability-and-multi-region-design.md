# Reliability and Multi-Region Design

## Purpose
Design GCP systems to meet explicit availability, RTO, and RPO objectives across zonal and regional failures.

## When to use
Use for critical services, disaster-recovery planning, architecture reviews, or recurring regional dependency concerns.

## Inputs
SLO, RTO, RPO, failure scenarios, data stores, dependencies, traffic routing, and budget.

## Context to inspect
Regional placement, load balancing, replicas, backup topology, DNS, queues, quotas, failover automation, and dependency geography.

## Core knowledge
Multi-region architecture only improves reliability when state, traffic, control planes, and dependencies can fail independently. More regions increase cost and operational complexity.

## Procedure
1. Define tolerated failure scenarios.
2. Map every critical dependency by failure domain.
3. Determine data replication and consistency needs.
4. Select active-active or active-passive strategy.
5. Design traffic failover.
6. Pre-provision quotas and capacity in failover regions.
7. Automate or script recovery actions.
8. Define backup restoration paths independent of replication.
9. Exercise regional failure regularly.
10. Measure achieved RTO/RPO.

## Decision points
Use active-active only when latency, scale, or recovery goals justify complexity. Prefer simpler regional HA when business objectives do not require multi-region continuity.

## Common failure patterns
Replicas without failover runbooks, shared regional dependencies, no quota headroom, and confusing backup with high availability.

## Verification
Run game days, disable dependencies selectively, and record actual recovery times/data loss.

## Expected output
A tested resilience architecture tied to business objectives.

## Stop conditions
Stop if RTO/RPO are undefined or data-consistency trade-offs lack business approval.