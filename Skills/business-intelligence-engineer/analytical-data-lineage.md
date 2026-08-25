# Analytical Data Lineage

## Purpose
Establish actionable lineage from source systems through transformations and semantic models to reports and metrics.

## When to use
Use for impact analysis, incident response, governance, migrations, audits, and deprecation planning.

## Inputs
Pipeline metadata, SQL/model definitions, semantic dependencies, report metadata, ownership, metric catalog.

## Context to inspect
Inspect orchestrators, warehouse objects, transformation repositories, semantic models, dashboards, external extracts, and manually maintained dependencies.

## Core knowledge
Useful lineage answers both upstream provenance and downstream blast radius. Technical lineage should be connected to business assets and owners; stale lineage is dangerous.

## Procedure
1. Define critical analytical assets and required lineage depth.
2. Capture source-to-target dependencies automatically where possible.
3. Add semantic-model and report dependencies.
4. Map governed metrics to their implementing fields/measures.
5. Attach ownership and criticality metadata.
6. Record manual/external transformations that automation misses.
7. Integrate lineage updates into deployment or metadata ingestion.
8. Use lineage during change review and incident triage.
9. Detect orphaned or stale lineage records.
10. Periodically validate high-criticality paths against actual execution/configuration.

## Decision points
Prefer automated column-level lineage for high-impact transformations when tooling supports it; table-level lineage may be sufficient for lower-risk operational mapping.

## Common failure patterns
Diagram-only lineage, no ownership, missing spreadsheets/extracts, stale metadata, and lineage that stops before semantic/report layers.

## Verification
Select critical dashboard metrics and trace them reproducibly to authoritative source fields; perform downstream impact queries for sample schema changes.

## Expected output
Searchable, maintained lineage with business context, ownership, and proven impact-analysis capability.

## Stop conditions
Stop when metadata access is unavailable, dynamic transformations prevent trustworthy inference without manual review, or compliance-sensitive lineage requires approval.