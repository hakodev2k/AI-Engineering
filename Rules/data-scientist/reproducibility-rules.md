# Reproducibility Rules
## Purpose
Make analytical results independently repeatable.
## Scope
Data snapshots, code, environments, parameters, seeds, and artifacts.
## MUST
- Version or identify source data, code, dependencies, configuration, parameters, and model artifacts used for material results.
- Make stochasticity explicit and control seeds where deterministic reproduction is expected.
- Preserve enough provenance to recreate released conclusions.
## MUST NOT
- Base approved results on untracked manual notebook edits or inaccessible local data.
## SHOULD
- Automate end-to-end reruns in clean environments for important analyses.
## Exceptions
Non-reproducible external inputs require captured evidence and documented limitation.
## Verification
Re-run from recorded inputs/environment or inspect provenance manifests, artifact hashes, and dependency locks.