# Training Reproducibility Rules

## Purpose
Make model results traceable, repeatable, and diagnosable.

## Scope
Training jobs, fine-tuning, distributed training, hyperparameter search, and checkpoints.

## MUST
- Every candidate model MUST be traceable to code revision, dataset version, configuration, dependencies, seeds where applicable, and hardware/runtime context.
- Training failures and resumed runs MUST preserve provenance.
- Checkpoints promoted beyond experimentation MUST have immutable identifiers and metadata.
- Non-deterministic operations that affect conclusions MUST be documented and bounded through repeated runs or equivalent evidence.

## MUST NOT
- A model artifact with unknown training provenance MUST NOT be promoted to production.
- Manually edited metrics or configuration records MUST NOT replace source-of-truth experiment artifacts.

## SHOULD
- Critical experiments SHOULD be reproducible from automated configuration and environment definitions.

## Exceptions
Irreproducible exploratory runs may inform hypotheses but not final acceptance claims.

## Verification
Inspect experiment metadata, source revision, dataset hashes, environment lockfiles, checkpoint registry, seeds, and rerun evidence.