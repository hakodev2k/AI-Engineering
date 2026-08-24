# Reliability and Resilience

## Purpose
Ensure Terraform designs infrastructure that meets explicit availability and recovery expectations.

## Scope
Redundancy, failure domains, backups, replication, recovery, health dependencies, and managed-service configuration.

## MUST
- Critical infrastructure MUST map design choices to defined availability and recovery objectives.
- Single points of failure MUST be intentional, documented, and accepted when present.
- Backup and recovery resources/configuration MUST be managed and tested according to data criticality.
- Changes affecting redundancy or failover MUST be reviewed for degraded-mode behavior.

## MUST NOT
- Multi-zone or replicated labels MUST NOT be treated as proof of recoverability without validating service semantics.
- Backup configuration MUST NOT be assumed sufficient without restoration evidence where restoration is required.
- Reliability controls MUST NOT be removed solely for cost or deployment convenience without approved trade-off analysis.

## SHOULD
- Failure-domain placement SHOULD be explicit for critical workloads.
- Recovery infrastructure SHOULD be reproducible from code where feasible.

## Exceptions
Lower resilience requires documented business acceptance, impact, detection, and recovery plan.

## Verification
Inspect architecture requirements, plans, zone/region topology, backup policies, restore tests, failover tests, service limits, and operational runbooks.