# Dataset Versioning and Reproducibility

## Purpose
Make every released dataset exactly identifiable and reproducible from governed sources, transformation code, configuration, and manifests so model results can be traced to the data that produced them.

## When to use
Use for all production training, fine-tuning, preference, retrieval, and evaluation datasets; when comparing experiments; when investigating regressions; or when rebuilding historical model inputs.

## Inputs
- Source snapshots or immutable references
- Transformation code and configuration
- Dataset schemas
- Random seeds and sampling policies
- Dependency/tool versions
- Output records and release metadata

## Context to inspect
Inspect source mutability, lineage records, storage retention, cleaning and filtering versions, manual edits, sampling randomness, external APIs, schema migrations, mixture configuration, and downstream training manifests.

## Core knowledge
A dataset version is more than a filename. Reproducibility requires immutable inputs or resolvable content hashes, deterministic or explicitly seeded transformations, versioned schemas, preserved configuration, and checksums for outputs. Mutable URLs, implicit defaults, and undocumented manual edits break reproducibility even when code is version-controlled.

## Procedure
1. Assign immutable identifiers or content hashes to all source snapshots.
2. Version schemas independently from data contents.
3. Record the exact transformation code revision and tool/dependency versions.
4. Capture all configuration, thresholds, prompts, sampling weights, and random seeds.
5. Eliminate undocumented manual edits or encode them as versioned transformations.
6. Generate a manifest of source IDs, output shards, record counts, checksums, and lineage references.
7. Store release-level quality, privacy, contamination, and distribution statistics.
8. Mark released artifacts immutable; create a new version for any change.
9. Reproduce a representative subset from source to final output and compare hashes or deterministic equivalence.
10. Periodically test reconstruction of historical releases while dependencies and source access remain available.
11. Link model-training runs to the exact dataset and mixture versions consumed.

## Decision points
Prefer immutable source snapshots when rights and storage policy allow them. Use content-addressed external references only when the referenced artifact is durably retrievable. Use delta releases for storage efficiency only if the base version and reconstruction path remain immutable and tested.

## Common failure patterns
- Referencing a source as `latest`
- Overwriting an existing release in place
- Recording code commits but not runtime configuration
- Omitting random seeds or sampling manifests
- Allowing manual spreadsheet edits outside the pipeline
- Storing dataset statistics without content checksums
- Deleting source versions required to reproduce active models

## Verification
Implemented means a release has immutable identifiers, manifests, configuration, lineage, and checksums. Verified means an independent reconstruction test can recreate representative or full outputs within the declared determinism guarantees and a model run can resolve every dataset dependency it consumed.

## Expected output
An immutable dataset release with version identifier, content manifest, source lineage, schema version, transformation/configuration metadata, checksums, statistics, reconstruction instructions, and model-consumer references.

## Stop conditions
Stop and escalate when required source material is no longer available, retention rights prohibit the artifacts needed for reconstruction, unexplained nondeterminism changes material outputs, or manual transformations cannot be captured reliably.