# Data Lineage Rules
## Purpose
Make data provenance and downstream impact traceable.
## Scope
Sources, transformations, datasets, reports, models, and published outputs.
## MUST
- Governed datasets MUST identify authoritative sources and material transformations.
- Lineage MUST support impact analysis for schema and semantic changes.
- Critical derived fields MUST be traceable to their upstream logic.
## MUST NOT
- MUST NOT claim lineage completeness when material manual or external steps are missing.
- MUST NOT make breaking changes without checking known downstream dependencies.
## SHOULD
- Prefer automated lineage capture augmented with human documentation for semantics.
## Exceptions
Temporary lineage gaps require owner, risk, and remediation date.
## Verification
Inspect lineage graphs, transformation metadata, catalog links, and change-impact reviews.