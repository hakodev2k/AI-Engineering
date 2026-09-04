# Pipeline Reproducibility Rules
## Purpose
Make curation outputs reproducible from declared inputs and transformations.
## Scope
Ingestion, cleaning, filtering, enrichment, labeling, sampling, splitting, and release pipelines.
## MUST
- Curation pipelines MUST pin code, configuration, dependency, and source versions required to reproduce a release.
- Non-deterministic steps MUST record seeds or equivalent controls when deterministic replay is practical.
- Pipeline failures MUST preserve diagnostic evidence and MUST NOT silently produce partial releases.
## MUST NOT
- Manual edits to released datasets MUST NOT bypass the governed pipeline without recorded provenance and review.
- Reproduction claims MUST NOT be made without executing a representative replay.
## SHOULD
- Pipelines SHOULD be idempotent where repeated execution is expected.
## Exceptions
Exceptions require documented non-reproducible elements, impact, and compensating evidence.
## Verification
Review CI runs, manifests, dependency locks, configuration, replay tests, and output hashes.