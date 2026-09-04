# Dataset Versioning Rules
## Purpose
Make curated datasets reproducible, comparable, and safely consumable across model iterations.
## Scope
Released datasets, snapshots, manifests, transformations, and metadata.
## MUST
- Every released dataset MUST have an immutable version identifier and manifest.
- Version metadata MUST record source versions, transformation versions, schema version, split definition, and material curation changes.
- Consumers MUST be able to identify exactly which dataset version produced a model or evaluation result.
## MUST NOT
- Released versions MUST NOT be mutated in place.
- Version identifiers MUST NOT be reused for different content.
## SHOULD
- Changelogs SHOULD distinguish additive, corrective, and breaking changes.
## Exceptions
Exceptions require documented migration and reproducibility impact.
## Verification
Inspect manifests, hashes, storage immutability, model metadata, changelogs, and reproducibility checks.