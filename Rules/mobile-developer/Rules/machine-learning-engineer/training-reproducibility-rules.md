# Training Reproducibility Rules
## Purpose
Make model behavior traceable to code, data, configuration, and environment.
## Scope
Training and tuning runs.
## MUST
- Record code revision, dataset version, configuration, random seeds where relevant, dependencies, hardware class, and produced artifact identity.
- Persist metrics and parameters for promoted candidates.
- Make training failures diagnosable from retained logs and metadata.
## MUST NOT
- Promote an artifact whose provenance cannot be established.
- Rely on notebook state as the sole training definition.
## SHOULD
- Make production training executable through versioned automation.
## Exceptions
Exploratory runs may be less strict but cannot be promoted directly.
## Verification
Re-run a representative training job and compare recorded provenance and expected metric tolerance.