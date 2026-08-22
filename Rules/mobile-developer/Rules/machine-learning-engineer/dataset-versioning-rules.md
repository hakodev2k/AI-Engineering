# Dataset Versioning Rules
## Purpose
Make training and evaluation reproducible.
## Scope
Datasets, labels, feature snapshots, and split definitions.
## MUST
- Record immutable dataset identity or reproducible query/snapshot metadata for every promoted model.
- Version label definitions and split logic with training code.
- Preserve lineage from source data through model artifact.
## MUST NOT
- Claim reproducibility when mutable data sources cannot reconstruct the run.
- Replace historical evaluation data without traceability.
## SHOULD
- Use content hashes or immutable snapshots for critical datasets.
## Exceptions
If retention is restricted, preserve sufficient metadata and approved reproducibility evidence.
## Verification
Reconstruct a sampled training run from recorded dataset and code identifiers.