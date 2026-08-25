# Training Pipelines and Reproducibility

## Purpose
Build repeatable recommendation training pipelines whose data, code, features, and model artifacts can be traced and reproduced.

## When to use
Use when operationalizing experiments, scheduling retraining, or investigating model provenance.

## Inputs
Training code, datasets, feature definitions, configuration, compute environment, artifact store, and validation gates.

## Context to inspect
Data snapshots, dependency versions, randomness, orchestration, retries, artifact lineage, and promotion process.

## Core knowledge
Reproducibility requires immutable or versioned inputs, deterministic-enough computation, explicit configuration, lineage, and artifact checks. Retry semantics must not create inconsistent partial outputs.

## Procedure
1. Version code, configuration, feature definitions, and dataset references.
2. Capture training cutoff and data lineage.
3. Pin runtime dependencies and random seeds where applicable.
4. Make stages idempotent and outputs immutable/versioned.
5. Add schema/data-quality checks before training.
6. Record metrics and artifact metadata after training.
7. Gate promotion on reproducible evaluation.
8. Test restart from intermediate failures.

## Decision points
Snapshot data when exact replay matters; retain logical point-in-time queries when storage cost dominates and sources are immutable. Retrain on schedule only when freshness value justifies compute.

## Common failure patterns
Mutable training tables, implicit defaults, unpinned packages, manual model copying, non-idempotent retries, and missing lineage.

## Verification
Re-run a prior training job and compare dataset fingerprints, configuration, metrics, and artifact behavior within expected nondeterminism.

## Expected output
An auditable training pipeline with lineage, validation, and reproducible artifacts.

## Stop conditions
Stop promotion when lineage is incomplete, data checks fail, or evaluation cannot be reproduced.