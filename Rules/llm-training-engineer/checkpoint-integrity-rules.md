# Checkpoint Integrity Rules

## Purpose
Ensure checkpoints are complete, authentic, recoverable, and compatible with their metadata.

## Scope
Model weights, optimizer states, schedulers, RNG state, dataloader position, distributed shards, and exported checkpoints.

## MUST
- Checkpoints MUST have stable identifiers and integrity hashes or equivalent corruption detection.
- Resume-capable checkpoints MUST include every state component required to reproduce the next training step within documented tolerances.
- Checkpoint completion MUST be atomic or use a completion marker so partial writes cannot be mistaken for valid artifacts.
- Restore logic MUST be tested before high-cost runs depend on it.
- Promoted checkpoints MUST record architecture, tokenizer, training step, code revision, and relevant dataset/configuration identities.

## MUST NOT
- MUST NOT overwrite the only known-good recovery checkpoint.
- MUST NOT publish a checkpoint that has not passed load and basic inference validation.
- MUST NOT assume all distributed shards exist because a coordinator reported success.

## SHOULD
- Critical checkpoints SHOULD be stored redundantly according to recovery requirements.
- Long runs SHOULD periodically test restoration in a separate process or environment.

## Exceptions
Weights-only research snapshots may omit optimizer state when clearly labeled non-resumable.

## Verification
Validate hashes, shard counts, completion markers, metadata, restore tests, next-step parity, and independent load/inference smoke tests.