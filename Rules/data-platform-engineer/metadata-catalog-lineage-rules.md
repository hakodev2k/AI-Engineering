# Metadata, Catalog, and Lineage Rules

## Purpose
Make production data discoverable, attributable, governable, and traceable across transformations.

## Scope
Applies to dataset catalog entries, ownership metadata, classifications, business definitions, technical lineage, and dependency metadata.

## MUST
- Production datasets MUST record an accountable owner, description, schema, classification, lifecycle state, and supported usage expectations.
- Critical derived datasets MUST have lineage sufficient to identify material upstream sources and downstream dependencies.
- Metadata changes that alter business meaning or governance classification MUST be reviewed with the same care as data-contract changes.
- Platform-generated lineage MUST distinguish verified relationships from inferred or incomplete relationships.
- Deprecated datasets MUST be marked clearly before removal and their known consumers assessed.

## MUST NOT
- MUST NOT present stale ownership or lineage metadata as authoritative when freshness cannot be established.
- MUST NOT expose sensitive metadata to principals that lack authorization for the underlying information.
- MUST NOT rely on undocumented tribal knowledge for ownership of production-critical data.

## SHOULD
- Automate metadata capture at ingestion, transformation, and publication boundaries.
- SHOULD measure catalog coverage and lineage completeness for governed datasets.

## Exceptions
Exceptions require documented scope, reason, risk, compensating evidence, remediation plan, and owner approval.

## Verification
Inspect catalog records, ownership freshness, classification tags, lineage graphs, deployment metadata hooks, deprecation records, and access-control tests.