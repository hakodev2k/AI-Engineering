# Data Lineage Rules

## Purpose
Make analytical dependencies and impact paths discoverable for safe change and incident response.

## Scope
Applies to sources, transformations, datasets, metrics, semantic models, and analytical products.

## MUST
- Critical published datasets MUST have discoverable upstream and downstream lineage.
- Lineage MUST identify the transformations or dependencies that materially affect an output.
- Breaking changes MUST use lineage to identify impacted consumers before release.
- Incident investigation MUST preserve evidence of the active lineage and versions involved.
- Orphaned or deprecated models MUST be removed only after downstream usage is checked.

## MUST NOT
- MUST NOT assume a dataset is unused solely because no owner remembers a consumer.
- MUST NOT make high-impact schema changes without downstream dependency analysis.
- MUST NOT represent inferred lineage as authoritative when confidence is unknown.

## SHOULD
- Automate lineage extraction from transformation and orchestration metadata.
- Include metric and dashboard dependencies where tooling supports them.

## Exceptions
Manual lineage is acceptable when automation is unavailable, but scope and evidence MUST be documented.

## Verification
Inspect dependency graphs, catalog metadata, query references, dashboards, and change-impact records.