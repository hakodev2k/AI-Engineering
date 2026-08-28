# Lineage and Metadata Rules

## Purpose
Ensure analytical data can be traced, understood, and governed through its lifecycle.

## Scope
Applies to source-to-target lineage, ownership metadata, classifications, descriptions, and operational metadata.

## MUST
- Critical datasets MUST expose upstream sources, transformations, downstream dependencies, and accountable owners.
- Metadata that drives governance or incident response MUST be kept current with schema changes.
- Derived measures and dimensions MUST document their authoritative definition and source lineage.
- Sensitive-data classifications MUST propagate through transformations where the sensitivity remains applicable.

## MUST NOT
- MUST NOT rely solely on tribal knowledge for critical lineage.
- MUST NOT remove lineage or ownership metadata during refactoring without replacement.

## SHOULD
- Lineage SHOULD be generated automatically where deterministic tooling can provide reliable evidence.
- Metadata quality SHOULD be included in release reviews for high-impact datasets.

## Exceptions
Manual lineage is acceptable when automation is unavailable, but it requires an owner and maintenance procedure.

## Verification
Inspect catalog metadata, lineage graphs, schema diffs, ownership records, and sampled end-to-end traces.