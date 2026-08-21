# Disaster Recovery

## Purpose
Design recovery for regional, platform, or large-scale infrastructure failure.

## When to use
Use for multi-region architecture, DR planning, failover testing, and business continuity exercises.

## Inputs
Critical services, dependencies, RTO/RPO, regions, DNS/traffic controls, data replication model.

## Context to inspect
Failure domains, secondary capacity, replicated data, secrets, DNS TTLs, external dependencies, runbooks, previous tests.

## Core knowledge
DR is an end-to-end capability, not just replicated data. Recovery includes identity, network, secrets, DNS, data, compute, observability, and dependent services.

## Procedure
1. Identify critical business journeys.
2. Map all regional dependencies.
3. Define recovery tier and objectives.
4. Choose backup/restore, pilot-light, warm-standby, or active-active.
5. Provision/test secondary dependencies.
6. Define data consistency and failback rules.
7. Automate traffic switching where safe.
8. Run controlled DR exercises.
9. Measure actual recovery.
10. Fix gaps and retest.

## Decision points
Use active-active only when complexity is justified; prefer simpler warm standby where RTO allows; choose failback deliberately after stabilization.

## Common failure patterns
Untested runbooks, missing secrets in DR region, insufficient quota, stale DNS assumptions, data replication without application validation.

## Verification
A controlled exercise recovers service within target and validates data integrity and failback.

## Expected output
Tested DR architecture, runbook, ownership, and evidence against RTO/RPO.

## Stop conditions
Stop if a DR test risks primary production without a controlled rollback plan.