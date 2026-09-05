# Data Quality Incident Response

## Purpose
Provide a disciplined response process for production data-quality failures affecting AI training, evaluation, or inference systems.

## When to use
Use for broken feeds, corrupted features, missing partitions, label defects, stale datasets, cross-source inconsistencies, or quality alerts with downstream impact.

## Inputs
Incident description, affected datasets, alerts, pipeline runs, recent changes, lineage, downstream model or product impact.

## Preconditions
Read access to quality telemetry and pipeline metadata is available.

## Context to inspect
Source systems, ingestion jobs, transformations, dataset versions, feature stores, training jobs, serving paths, releases, and recent backfills.

## Core knowledge
A data-quality incident should be managed by blast radius and reversibility. Containment may require quarantining a dataset, freezing model training, rolling back a feature version, or serving last-known-good data.

## Procedure
1. Confirm the failing quality dimension.
2. Identify affected datasets, partitions, models, and consumers.
3. Estimate blast radius and duration.
4. Preserve evidence before corrective writes.
5. Contain by quarantining, freezing publication, or reverting to known-good data.
6. Trace the earliest bad transformation or source event.
7. Correct the defect and reprocess only affected scope.
8. Revalidate all critical quality checks.
9. Resume consumers gradually.
10. Record root cause, detection gaps, and prevention actions.

## Decision points
Prefer rollback to known-good data when impact is active and root cause is uncertain. Reprocess only when lineage proves the affected scope.

## Common failure patterns
Fixing data before preserving evidence, reprocessing the entire history, leaving bad cached features in serving, and declaring recovery before downstream validation.

## Verification
Corrected data passes validation, downstream consumers point to the intended version, and representative model or product checks recover.

## Expected output
An incident record containing scope, containment, root cause, repair, verification, and corrective actions.

## Stop conditions
Stop and escalate when the scope cannot be bounded or corrective processing could overwrite trustworthy data.