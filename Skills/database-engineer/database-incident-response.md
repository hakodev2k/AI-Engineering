# Database Incident Response

## Purpose
Restore database-backed service safely during production incidents while preserving evidence and preventing secondary damage.

## When to use
Use for severe latency, connection exhaustion, blocking storms, storage pressure, replication failures, corruption signals, failed deployments, or database outages.

## Inputs
Incident timeline, alerts, metrics, logs, query telemetry, topology, recent changes, runbooks, and service impact.

## Context to inspect
Inspect current health before changing anything: availability, saturation, waits, blocking, replication, storage, backups, recent DDL/configuration, and application error patterns.

## Core knowledge
Incident work prioritizes service restoration and evidence over elegant permanent fixes. Changes should be reversible, scoped, and based on the strongest available signal.

## Procedure
1. Establish incident severity, impact, and command ownership.
2. Freeze unnecessary changes.
3. Capture time-stamped health and workload evidence.
4. Identify whether failure is capacity, contention, query regression, infrastructure, storage, replication, or integrity related.
5. Apply the lowest-risk mitigation that reduces impact.
6. Protect data correctness while restoring availability.
7. Verify service behavior after each intervention.
8. Preserve logs, plans, and configuration evidence.
9. Transition from mitigation to durable remediation after stabilization.
10. Produce a blameless root-cause review with prevention actions.

## Decision points
Prefer rollback or traffic reduction when a recent change strongly correlates with failure. Avoid restarts unless they address a known mechanism or are necessary to restore service.

## Common failure patterns
Random tuning during outage, clearing caches before evidence capture, multiple simultaneous changes, killing sessions indiscriminately, and declaring recovery from infrastructure metrics alone.

## Verification
Confirm user-facing recovery, database correctness, stable resource levels, and absence of recurring symptoms.

## Expected output
Restored service, preserved evidence, incident timeline, root cause, and tracked corrective actions.

## Stop conditions
Escalate suspected corruption, unrecoverable data loss, security compromise, or actions requiring authority beyond the incident role.