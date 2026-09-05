# Release Checkpoint Rules

## Purpose
Ensure only qualified, traceable checkpoints leave the training pipeline for downstream deployment or distribution.

## Scope
Checkpoint promotion, conversion, export, handoff, artifact storage, model cards/metadata, and release approval.

## MUST
- A release checkpoint MUST pass integrity, load, evaluation, safety, compatibility, and required regression gates.
- Release artifacts MUST preserve lineage to training configuration, code, tokenizer, datasets, and source checkpoint.
- Conversion or export MUST be validated for numerical/behavioral parity within declared tolerances.
- Known limitations and failed/waived gates MUST accompany the handoff.
- Production deployment, public distribution, or other high-impact release MUST require authorized human approval.

## MUST NOT
- MUST NOT release the latest checkpoint merely because training completed.
- MUST NOT replace an approved artifact in place while retaining the same immutable version identity.
- MUST NOT omit material known regressions from release documentation.

## SHOULD
- Release candidates SHOULD be stored immutably with checksums and reproducible conversion tooling.
- Handoffs SHOULD include intended serving precision, context limits, tokenizer, and compatibility constraints.

## Exceptions
Internal research sharing may use lighter gates if access and non-production status are explicit.

## Verification
Inspect gate reports, artifact hashes, lineage metadata, conversion parity, limitations, access scope, and human approval records.