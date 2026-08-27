# Lineage-Driven Impact Analysis

## Purpose
Use data lineage to determine which upstream causes and downstream consumers are affected by a data change or incident.

## When to use
Use during incidents, schema changes, migrations, deprecations, and reliability reviews for shared datasets.

## Inputs
Dataset lineage, transformation graph, orchestration dependencies, BI/report dependencies, data contracts, ownership metadata.

## Preconditions
Lineage must be sufficiently current to support decisions. Unknown lineage should be treated as risk, not absence of impact.

## Context to inspect
Inspect table, column, job, dashboard, API, and ML-feature dependencies where available, plus manually documented consumers.

## Core knowledge
Runtime dependency and semantic dependency are not always identical. Column-level lineage provides precision but can be expensive to maintain. Senior engineers use lineage as evidence while validating critical paths with real usage and ownership data.

## Procedure
1. Identify the changed or failing data asset.
2. Traverse upstream dependencies to isolate likely causes.
3. Traverse downstream dependencies to enumerate potential blast radius.
4. Prioritize consumers by business criticality and recency of use.
5. Distinguish direct from transitive dependencies.
6. Validate high-impact paths against query or usage telemetry.
7. Notify responsible owners with concrete affected assets.
8. Record missing lineage discovered during response.
9. Update lineage capture or metadata after remediation.

## Decision points
Use column-level lineage when field changes drive risk; dataset-level lineage may suffice for operational outages. Treat stale lineage conservatively for high-impact systems.

## Common failure patterns
- Assuming no recorded lineage means no consumers
- Ignoring ad hoc or external consumers
- Treating orchestration DAGs as complete lineage
- Failing to distinguish active and obsolete dependencies

## Verification
Cross-check lineage against runtime queries, orchestration metadata, and known consumer inventories; validate impact predictions during controlled changes.

## Expected output
A ranked blast-radius analysis with upstream suspects, downstream consumers, owners, and confidence notes.

## Stop conditions
Escalate when lineage is materially incomplete for a high-risk change or when unmanaged external consumers cannot be identified.