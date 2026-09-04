# Model Versioning and Lineage

## Purpose
Ensure every deployed model can be traced to the exact code, data, configuration, dependencies, and evaluation evidence that produced it.

## When to use
Use for production model promotion, incident investigation, rollback readiness, audits, or reproducibility work.

## Inputs
- Model artifacts
- Training run metadata
- Dataset identifiers
- Source revision
- Dependency environment
- Evaluation results

## Context to inspect
Inspect artifact registry, experiment tracking, dataset versioning, feature definitions, build provenance, and deployment manifests.

## Core knowledge
A model version is not just a binary artifact. Reliable lineage links model weights to code, data snapshots, preprocessing, configuration, environment, metrics, approvals, and serving state.

## Procedure
1. Assign immutable identifiers to model artifacts.
2. Record source revision, configuration, random seeds, and dependency lock state.
3. Record training and validation dataset versions or reproducible queries.
4. Attach preprocessing and feature-definition versions.
5. Store evaluation metrics and acceptance evidence.
6. Link deployment versions back to the registry artifact.
7. Prevent mutable artifact replacement.
8. Test rollback and reproduction from lineage metadata.

## Decision points
Use content-addressed artifacts where practical. If full dataset snapshots are too large, preserve immutable source versions and deterministic extraction manifests.

## Common failure patterns
- Reusing tags such as latest.
- Model weights without preprocessing version.
- Dataset query changed after training.
- Missing dependency versions.

## Verification
Reproduce a historical model or equivalent evaluation from recorded lineage and confirm the deployed artifact hash matches registry records.

## Expected output
An immutable lineage record connecting deployed model, training run, data, code, configuration, and evidence.

## Stop conditions
Stop promotion if lineage is incomplete enough that rollback or reproduction cannot be trusted.