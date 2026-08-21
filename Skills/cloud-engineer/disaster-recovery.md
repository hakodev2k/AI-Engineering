# Disaster Recovery

## Purpose
Create and validate recovery strategies for destructive, regional, operational, and data-loss scenarios.

## When to use
Use for business-critical workloads and whenever recovery objectives or architecture change.

## Inputs
Business impact, RTO, RPO, dependencies, backup topology, regional options, runbooks.

## Context to inspect
Backups, replicas, encryption keys, DNS, identity, infrastructure code, artifact stores, external dependencies, recovery permissions.

## Core knowledge
DR must recover the service, data, configuration, identity, and dependencies. A backup that has never been restored is unverified.

## Procedure
1. Define scenario-specific RTO/RPO.
2. Map recovery dependencies and ordering.
3. Select backup/restore, pilot-light, warm-standby, or active-active strategy.
4. Separate backup failure domains and protect deletion.
5. Automate infrastructure recreation.
6. Document data restoration and reconciliation.
7. Define traffic cutover and failback.
8. Assign decision authority and communications.
9. Run scheduled recovery exercises.
10. Record actual recovery times and gaps.

## Decision points
Choose simpler recovery patterns unless business impact justifies continuously running redundant capacity.

## Common failure patterns
Backups in the same failure domain, missing keys, stale runbooks, dependencies omitted, recovery credentials unavailable, and no failback plan.

## Verification
Perform an end-to-end exercise and prove restored service integrity plus measured RTO/RPO.

## Expected output
A tested recovery plan with evidence and owners.

## Stop conditions
Escalate if recovery objectives cannot be achieved or critical data cannot be restored reliably.