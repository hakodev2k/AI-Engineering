# Metadata, Lineage, and Catalog

## Purpose
Make datasets discoverable, understandable, owned, and traceable from source to consumer.

## When to use
Use when a platform has multiple producers, transformations, datasets, or teams and tribal knowledge no longer scales.

## Inputs
Datasets, schemas, pipeline graphs, owners, business definitions, access classifications, and consumer relationships.

## Context to inspect
Inspect catalogs, orchestrator metadata, query history, transformation definitions, source identifiers, naming conventions, and current ownership gaps.

## Core knowledge
Technical metadata describes structure and execution; business metadata explains meaning; operational metadata describes health and usage. Lineage should be automated where possible and useful at dataset and field level according to risk.

## Procedure
1. Define authoritative dataset identifiers.
2. Capture schema, location, owner, domain, and lifecycle state.
3. Attach business definitions to important fields and metrics.
4. Extract lineage from transformation and orchestration metadata.
5. Record classifications and access expectations.
6. Surface freshness, quality, and usage metadata.
7. Define ownership review and deprecation workflows.
8. Avoid duplicate catalog entries for the same logical asset.
9. Validate lineage against representative pipelines.
10. Use catalog metadata during incident and impact analysis.

## Decision points
Implement field-level lineage for high-risk transformations where dataset-level lineage is insufficient; avoid expensive precision where it does not improve decisions.

## Common failure patterns
Manual lineage that becomes stale, owner fields without accountability, cataloging raw technical names without business meaning, and treating documentation coverage as data trust.

## Verification
Trace selected consumer fields back to sources, verify owners, compare lineage with actual transformations, and test impact analysis for a proposed schema change.

## Expected output
A maintained metadata system that supports discovery, ownership, impact analysis, governance, and troubleshooting.

## Stop conditions
Escalate when no authoritative asset identity or ownership model exists and duplicates cannot be resolved safely.