# Data Lineage Rules

## Purpose
Ensure training and evaluation data can be traced, governed, reproduced, and investigated after release.

## Scope
Covers datasets, labels, features, transformations, sampling, joins, and snapshots used by ML pipelines.

## MUST
- Every release candidate MUST reference immutable or reproducibly snapshot-able input datasets and transformation versions.
- Lineage MUST record source, extraction time/window, transformation code revision, schema, filtering, sampling, and feature definitions that materially affect the model.
- Training and evaluation datasets MUST have documented ownership and permitted use.
- Data corrections affecting released models MUST trigger impact analysis.

## MUST NOT
- Production training MUST NOT consume an unversioned mutable dataset without a reproducible snapshot mechanism.
- Evaluation data MUST NOT be silently mixed into training data.
- Lineage metadata MUST NOT expose protected raw values unnecessarily.

## SHOULD
- Data contracts SHOULD detect incompatible schema and semantic changes before training.
- Lineage SHOULD connect deployed model versions back to exact data snapshots.

## Exceptions
Any unavoidable mutable source requires a captured extraction manifest, reconciliation evidence, documented risk, and owner approval.

## Verification
Inspect lineage graph/manifests, snapshot identifiers, schemas, access controls, transformation revisions, and train/evaluation separation checks. Reconstruct a sample lineage path from deployed model to source data.