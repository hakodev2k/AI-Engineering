# Train, Validation, and Test Splitting

## Purpose
Create statistically meaningful and leakage-resistant dataset splits that support honest model development and evaluation.

## When to use
Use whenever examples are divided for training, tuning, model selection, or final evaluation, especially when records share users, documents, sessions, entities, time periods, or source families.

## Inputs
Dataset, grouping keys, timestamps, provenance, target evaluation use, contamination policy, and split-size requirements.

## Context to inspect
Inspect duplicate clusters, session or document boundaries, entity relationships, temporal ordering, source overlap, labeling process, and downstream hyperparameter tuning behavior.

## Core knowledge
Random row splitting is unsafe when correlated examples share latent information. Grouped, temporal, source-held-out, entity-held-out, and distribution-shift splits answer different questions. Test sets lose value when repeatedly inspected or used for prompt and model tuning.

## Procedure
1. Define the generalization question each split must answer.
2. Identify correlation units larger than individual rows.
3. Deduplicate before splitting where appropriate.
4. Choose group, temporal, source, entity, or stratified split logic.
5. Protect rare critical slices across validation and test.
6. Ensure benchmark and contamination exclusions apply before assignment.
7. Freeze test identifiers and access controls.
8. Measure distribution differences across splits.
9. Check for cross-split near duplicates and shared groups.
10. Version the split manifest independently from record ordering.

## Decision points
Use temporal holdouts for future-behavior claims, source holdouts for robustness to new sources, and grouped splits for user/document independence. Keep a final untouched test set when repeated experimentation would otherwise overfit validation.

## Common failure patterns
- Randomly splitting chunks from the same document
- Letting one user appear in all splits
- Rebuilding test sets after observing results
- Ignoring near duplicates
- Using hidden test data for prompt iteration

## Verification
Implemented means split assignment is deterministic. Verified means leakage checks pass, grouping constraints hold, slice coverage is adequate, and test access history shows it was not used for training decisions.

## Expected output
Versioned split manifests, rationale, leakage checks, distribution statistics, and access policy.

## Stop conditions
Stop when grouping identifiers are unavailable for correlated records, test independence cannot be maintained, or split sizes make required evaluation slices statistically unusable.