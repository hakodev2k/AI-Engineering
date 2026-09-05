# Dataset Versioning and Certification

## Purpose
Create trustworthy, reproducible dataset releases for AI training, evaluation, and production use.

## When to use
Use when publishing a dataset, promoting a data snapshot to production, reproducing a model run, or deprecating an older data version.

## Inputs
Dataset contents, schema, lineage, quality results, source snapshot identifiers, transformation versions, intended consumers, release notes.

## Preconditions
The dataset has completed required validation and lineage can identify its inputs and transformations.

## Context to inspect
Dataset registry, object storage, feature store, training manifests, model registry, retention policy, consumer dependencies, and release workflow.

## Core knowledge
A dataset version must identify both content and semantics. Reproducibility requires immutable references to source snapshots, code, configuration, schemas, and quality evidence. A mutable path named latest is not a sufficient release artifact.

## Procedure
1. Define the release boundary and intended consumers.
2. Generate an immutable dataset identifier or content version.
3. Record source snapshots and transformation versions.
4. Attach schema and data-quality results.
5. Record known limitations and intended use.
6. Verify row counts, partitions, checksums or equivalent integrity evidence.
7. Link the release to downstream training or evaluation manifests.
8. Publish through a controlled promotion step.
9. Mark superseded versions without deleting needed reproducibility evidence.
10. Test that a consumer can retrieve the exact certified version independently.

## Decision points
Create a new version whenever content or semantics change materially. Use aliases only as pointers to immutable certified versions.

## Common failure patterns
Overwriting datasets in place, versioning only by date, missing transformation versions, certifying before quality checks complete, and deleting old versions needed for model reproduction.

## Verification
A model or evaluation run can resolve the exact certified dataset and reproduce its schema, lineage, and quality evidence.

## Expected output
An immutable certified dataset release with version metadata, quality evidence, lineage, and usage notes.

## Stop conditions
Stop when source snapshots are mutable, validation is incomplete, or lineage gaps prevent reproducibility.