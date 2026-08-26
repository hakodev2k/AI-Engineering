# Reproducibility

## Purpose
Ensure material ML results can be reconstructed and audited.

## Scope
Training, evaluation, feature generation, datasets, environments, and experiments.

## MUST
- Every promoted model MUST trace to code revision, configuration, dataset/feature versions, environment, and evaluation evidence.
- Randomness that affects results MUST be controlled or explicitly characterized.
- Reproduction procedures MUST identify external dependencies that can change independently.

## MUST NOT
- A model MUST NOT be promoted from an untraceable notebook or ad-hoc environment.
- Mutable labels such as `latest` MUST NOT be the only identity for production inputs or artifacts.

## SHOULD
- Critical pipelines SHOULD support one-command or automated reconstruction from recorded metadata.

## Exceptions
Irreproducible external inputs require captured evidence, impact analysis, and approval before promotion.

## Verification
Re-run representative experiments from recorded metadata and compare artifacts, metrics, lineage, dependency locks, and environment fingerprints.