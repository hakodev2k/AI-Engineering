# Lineage and Metadata Rules

## Purpose
Keep BI assets discoverable, explainable, and traceable from source to consumer.

## Scope
Applies to datasets, transformations, semantic models, metrics, reports, and dashboards.

## MUST
- Critical BI assets MUST identify owner, purpose, authoritative sources, and downstream consumers where tooling permits.
- Material transformations MUST be traceable to their upstream inputs.
- Deprecated assets MUST be marked with replacement or retirement guidance.
- Metadata used for governance MUST be maintained as part of the change process.

## MUST NOT
- MUST NOT represent an asset as authoritative when ownership or source provenance is unknown.
- MUST NOT remove a shared asset without checking known downstream dependencies.

## SHOULD
- Metadata collection SHOULD be automated from deployed artifacts where practical.

## Exceptions
Exceptions require documented tooling limits, manual traceability evidence, and a responsible owner.

## Verification
Inspect catalog entries, lineage graphs, deployment metadata, ownership fields, and dependency reports.