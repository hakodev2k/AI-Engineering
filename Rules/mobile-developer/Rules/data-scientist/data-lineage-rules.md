# Data Lineage Rules
## Purpose
Make analytical inputs and transformations traceable.
## Scope
Sources, joins, transformations, labels, features, datasets, and outputs.
## MUST
- Record authoritative sources and transformation lineage for material datasets and derived metrics.
- Preserve semantic definitions for keys, timestamps, filters, units, and aggregation levels.
- Assess downstream impact before changing shared derived data.
## MUST NOT
- Treat similarly named fields from different systems as semantically equivalent without validation.
- Publish critical metrics whose derivation cannot be traced.
## SHOULD
- Automate lineage capture where supported.
## Exceptions
Manual lineage is acceptable when tooling is unavailable if it remains complete and reviewable.
## Verification
Trace sampled outputs back to source records and inspect transformation definitions, schemas, and ownership.