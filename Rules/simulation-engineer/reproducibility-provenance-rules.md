# Reproducibility and Provenance Rules
## Purpose
Make results reconstructable and auditable.
## Scope
Models, code, datasets, configuration, dependencies, seeds, and execution environments.
## MUST
- Record the exact model/code revision, input dataset versions, configuration, dependencies, and seed for decision-grade runs.
- Preserve immutable run identifiers and output provenance.
- Make transformations from source data to simulation input traceable.
## MUST NOT
- Manually alter reported outputs without preserving the original and transformation record.
- rely on mutable latest-version dependencies for audited results.
## SHOULD
- Automate environment capture and run manifests.
## Exceptions
Restricted data may use references or hashes instead of copies.
## Verification
Re-run sampled experiments from manifests and compare outputs within defined tolerances.