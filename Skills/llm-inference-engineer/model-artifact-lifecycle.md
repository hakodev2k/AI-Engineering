# Model Artifact Lifecycle

## Purpose
Make model acquisition, conversion, storage, loading, and rollback reproducible and auditable.

## When to use
Use for any new model, quantized variant, tokenizer change, runtime conversion, or artifact-store migration.

## Inputs
Source revision, license, tokenizer, configuration, conversion pipeline, checksums, storage location, and runtime requirements.

## Context to inspect
Artifact registry, access control, manifests, conversion tooling, model loader, cache directories, and deployment metadata.

## Core knowledge
Model weights, tokenizer, config, adapters, and runtime-specific artifacts form one compatibility unit. Mutable tags and undocumented conversions create silent correctness failures.

## Procedure
1. Pin immutable upstream revisions and record license/provenance.
2. Verify expected files and checksums.
3. Run deterministic conversion/quantization where possible.
4. Produce a manifest containing source revision, tooling versions, format, precision, tokenizer, and checksums.
5. Store artifacts immutably with least-privilege access.
6. Validate loading on target runtime/hardware.
7. Run smoke quality and generation tests.
8. Promote through environments using artifact identity, not mutable names.
9. Retain the prior known-good artifact and rehearse rollback.

## Decision points
Pre-convert artifacts when startup time or runtime dependencies justify it; otherwise preserve simpler native formats. Duplicate artifacts only when isolation or locality benefits exceed storage cost.

## Common failure patterns
Tokenizer mismatch, mutable latest tags, untracked conversion flags, corrupted partial downloads, and deleting rollback artifacts too early.

## Verification
Rebuild from manifest, compare checksums, load on target fleet, and verify known prompts/tests.

## Expected output
Immutable artifact plus provenance manifest and promotion/rollback evidence.

## Stop conditions
Stop when provenance, licensing, or integrity cannot be established.