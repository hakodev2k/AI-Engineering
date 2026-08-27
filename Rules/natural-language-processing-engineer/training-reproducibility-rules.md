# Training Reproducibility Rules

## Purpose
Make NLP training runs traceable enough to reproduce, compare, and audit.

## Scope
Code, data, tokenizer, model initialization, hyperparameters, seeds, environment, checkpoints, and experiment records.

## MUST
- Every decision-relevant training run MUST record code revision, data versions, tokenizer/model artifacts, hyperparameters, and runtime environment.
- Random seeds and nondeterministic operations MUST be documented where they can affect comparison.
- Checkpoints promoted toward production MUST be traceable to their training configuration and evaluation evidence.
- Material experiments MUST preserve enough metadata to explain differences between runs.

## MUST NOT
- MUST NOT promote an artifact whose lineage cannot be established.
- MUST NOT compare experiments while silently changing multiple uncontrolled variables.
- MUST NOT overwrite experiment records needed for audit or rollback.

## SHOULD
- Training SHOULD be reproducible within documented numerical tolerance.
- Experiment naming and artifact metadata SHOULD be machine-queryable.

## Exceptions
Exact determinism may be impractical on some accelerators; acceptable variance and repeated-run evidence must then be documented.

## Verification
Re-run selected experiments, compare artifact hashes and metadata, inspect environment locks, verify lineage links, and test that production artifacts resolve to complete experiment records.