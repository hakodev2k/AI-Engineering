# Cloud Failure-Domain Validation

## Purpose
Validate that cloud architecture actually tolerates loss or degradation within documented failure domains such as instances, zones, regions, and managed-service replicas.

## When to use
Use when systems claim multi-zone or multi-region resilience, depend on managed-service failover, or after architecture changes that alter placement or routing.

## Inputs
Cloud architecture, region and zone topology, service quotas, routing, load balancers, autoscaling, data replication, RTO/RPO, SLOs, and disaster recovery plans.

## Preconditions
Failure domains are mapped, provider safeguards are understood, and recovery paths can be observed without destructive data loss.

## Context to inspect
Instance placement, zone affinity, cross-zone load balancing, regional dependencies, managed database topology, DNS, object storage, queues, identity, KMS, quotas, and control-plane assumptions.

## Core knowledge
Nominal multi-zone deployment does not guarantee independence. Shared regional services, quotas, identity, networking, and control planes can become common-mode dependencies. Senior validation distinguishes compute redundancy from data, routing, and operational continuity.

## Procedure
1. Define the claimed failure tolerance.
2. Map resources to provider failure domains.
3. Identify shared regional or account-level dependencies.
4. Establish baseline traffic and replication health.
5. Select the smallest failure-domain scenario that tests the claim.
6. Define traffic, data, and recovery guardrails.
7. Execute the scenario within approved scope.
8. Observe routing, capacity, data consistency, and autoscaling.
9. Measure failover and recovery against RTO/RPO and SLOs.
10. Confirm the system returns to the intended balanced state.

## Decision points
Test zone-level resilience before region-level resilience. Use provider-supported simulation or controlled target isolation where direct disruption would create unacceptable risk.

## Common failure patterns
Nominal redundancy with all capacity concentrated in one zone; insufficient quota during failover; regional dependencies in supposedly multi-region systems; stale DNS; replication lag exceeding RPO; and manual recovery steps not reflected in RTO assumptions.

## Verification
Compare measured behavior with architecture claims, capacity plans, SLOs, and recovery objectives. Confirm no hidden common-mode dependency invalidates the claimed resilience tier.

## Expected output
Evidence-backed failure-domain assessment, measured failover characteristics, and prioritized remediation.

## Stop conditions
Stop if the experiment risks irreversible data loss, provider limits are unknown, or the recovery path cannot be safely controlled.