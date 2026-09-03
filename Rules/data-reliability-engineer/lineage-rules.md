# Data Lineage Rules

## Purpose
Maintain trustworthy traceability from source data to derived outputs.

## Scope
Datasets, transformations, jobs, storage layers, reports, features, and downstream exports.

## MUST
- Record upstream and downstream dependencies for critical production datasets.
- Preserve enough lineage to identify which sources and transformations contributed to an output.
- Update lineage when production dependencies or transformation paths change.
- Use lineage during impact analysis for incidents and breaking changes.

## MUST NOT
- Treat manually remembered dependency knowledge as sufficient for critical data flows.
- Publish derived datasets with unknown provenance when they drive operational or business decisions.
- Hide cross-system dependencies that materially affect reliability.

## SHOULD
- Capture lineage automatically from orchestration, query, or metadata systems where practical.
- Include ownership and freshness metadata alongside dependency edges.

## Exceptions
Manual lineage is acceptable only when automation is unavailable and ownership plus review cadence are defined.

## Verification
Inspect lineage graphs, metadata catalogs, orchestration definitions, transformation references, and sampled end-to-end traces.