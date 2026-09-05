# Provenance, Versioning, and Lineage

## Purpose
Make every synthetic dataset reproducible and auditable by recording how each release was generated, filtered, labeled, transformed, and approved.

## When to use
Use for all production-grade synthetic datasets, especially those used for model training, evaluation, regulated workflows, or cross-team sharing.

## Inputs
Generator version, prompts/configuration, source datasets, model versions, seeds, transformation steps, validators, reviewers, release metadata.

## Preconditions
Dataset storage and metadata systems support immutable version identifiers or equivalent traceability.

## Context to inspect
Existing data catalog, model registry, experiment tracker, object storage, build pipeline, retention policy, approval workflow, access controls.

## Core knowledge
Synthetic datasets are software-like artifacts. Small prompt, model, seed, simulator, or filtering changes can materially alter behavior. Reproducibility requires lineage across source data, generator artifacts, validation rules, and downstream releases.

## Procedure
1. Assign immutable identifiers to generator, configuration, and dataset release.
2. Record source dataset versions and permitted usage scope.
3. Record model/provider version, prompt/template version, decoding settings, and seeds where available.
4. Track all filtering, repair, labeling, deduplication, and sampling stages.
5. Store quality, utility, privacy, fairness, and contamination reports with the release.
6. Capture reviewer approvals and known limitations.
7. Maintain parent-child lineage for regenerated or merged datasets.
8. Prevent silent replacement of released artifacts.
9. Make downstream training/evaluation runs reference exact dataset versions.
10. Test that an approved sample of the dataset can be reproduced from recorded metadata.

## Decision points
Store row-level lineage when risk, debugging, or compliance requires it; otherwise dataset/batch-level lineage may be sufficient. Avoid storing sensitive raw prompts or source data when metadata can provide traceability without unnecessary exposure.

## Common failure patterns
Using mutable folder names like latest, recording only the final file, losing prompt/model versions, and regenerating a dataset without changing its version.

## Verification
A reviewer can trace any released dataset to generator inputs, configuration, processing steps, validation evidence, and downstream consumers.

## Expected output
An auditable lineage record, immutable dataset version, release metadata, and reproducibility evidence.

## Stop conditions
Stop release when critical generator or source provenance is missing, version identifiers are ambiguous, or required lineage would expose restricted data without an approved storage design.