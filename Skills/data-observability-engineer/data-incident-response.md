# Data Incident Response

## Purpose
Coordinate diagnosis, containment, recovery, and communication for production data incidents while preserving evidence and preventing further corruption.

## When to use
Use when critical data is late, missing, duplicated, corrupted, semantically wrong, or unavailable to consumers.

## Inputs
Incident alert, affected datasets, lineage, recent changes, pipeline telemetry, quality checks, ownership, recovery options.

## Preconditions
Incident severity and decision authority should be known. Preserve raw evidence before destructive remediation.

## Context to inspect
Inspect source availability, recent deployments, job runs, schema changes, partitions, query results, lineage, dashboards, and prior incidents.

## Core knowledge
Data incidents require balancing recovery speed with correctness. Re-running blindly can duplicate or overwrite data. Senior response separates containment, diagnosis, repair, validation, and communication.

## Procedure
1. Confirm the incident and establish severity.
2. Identify affected data products and consumer blast radius.
3. Freeze risky writes or downstream publication when necessary.
4. Preserve logs, run IDs, samples, and metadata.
5. Build a timeline of source, pipeline, and publication events.
6. Form hypotheses and test them against evidence.
7. Choose the lowest-risk containment and recovery action.
8. Validate repaired data independently before republishing.
9. Communicate status and consumer guidance.
10. Record root cause, contributing factors, and preventive actions.

## Decision points
Prefer rollback when recent changes clearly caused the incident and rollback is safe. Prefer targeted backfill over broad replay when idempotency is uncertain. Quarantine questionable data rather than publishing unverified repairs.

## Common failure patterns
- Re-running before understanding idempotency
- Fixing the job but not corrupted outputs
- No downstream impact analysis
- Closing after green pipeline status without data verification
- Losing evidence during cleanup

## Verification
Compare repaired outputs with source or trusted references, rerun quality controls, and confirm consumers receive correct data.

## Expected output
Contained incident, verified recovery, stakeholder communication, and documented corrective actions.

## Stop conditions
Escalate before destructive rollback, irreversible data mutation, uncertain financial/regulatory impact, or actions requiring production permissions not held.