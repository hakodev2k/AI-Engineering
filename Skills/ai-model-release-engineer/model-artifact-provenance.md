# Model Artifact Provenance

## Purpose
Establish reproducible, auditable lineage from a released AI artifact back to code, configuration, data references, training or adaptation inputs, and build environment.

## When to use
Use when packaging, approving, promoting, investigating, or reproducing a model release.

## Inputs
Artifact digest, source revision, build metadata, model card, dependency lockfiles, dataset identifiers, training/adaptation configuration, and registry records.

## Preconditions
The organization has a durable artifact store or registry and can compute immutable hashes.

## Context to inspect
Inspect build pipelines, registries, dependency resolution, data-versioning conventions, signing controls, and promotion history.

## Core knowledge
Names and tags are mutable; cryptographic digests and immutable version IDs are stronger identities. Provenance must capture enough context to reproduce or explain an artifact without embedding secrets or regulated data.

## Procedure
1. Identify the exact release artifact and compute or retrieve its digest.
2. Link it to source commit and build workflow execution.
3. Capture model base version, adaptation method, configuration, tokenizer, and runtime dependencies.
4. Record dataset or corpus version references without copying sensitive content.
5. Record evaluation bundle and policy versions used for approval.
6. Verify generated artifacts are not modified after signing or registration.
7. Store provenance metadata beside the immutable artifact.
8. Test reverse lookup from production version to all required lineage records.

## Decision points
Use stronger signing/attestation when supply-chain risk or compliance requirements justify it. Record logical dataset snapshots when physical duplication is unsafe or impractical.

## Common failure patterns
Mutable `latest` tags as identity, missing tokenizer lineage, unpinned dependencies, undocumented post-training transforms, provenance stored only in CI logs, and secrets captured in metadata.

## Verification
Select a deployed version and reconstruct its source, build, dependency, data-reference, evaluation, and approval lineage. Verify hashes against stored artifacts.

## Expected output
A complete provenance record with immutable identifiers and traceable evidence.

## Stop conditions
Stop if artifact identity is ambiguous, required lineage is unavailable, integrity checks fail, or provenance collection would expose protected data.
