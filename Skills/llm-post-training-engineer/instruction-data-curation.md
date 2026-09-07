# Instruction Data Curation

## Purpose
Build high-signal supervised instruction data that teaches target behavior while preserving breadth, safety, and generalization.

## When to use
Use when preparing or refreshing SFT data, adapting a model to a domain, repairing weak instruction-following behavior, or adding new response formats. Do not use curation as a substitute for fixing an unclear product specification.

## Inputs
- Target behaviors and rubrics
- Raw demonstrations or candidate conversations
- Base-model failure samples
- Policy constraints
- Data provenance and licensing metadata
- Evaluation slices

## Preconditions
Data use is authorized, sensitive data handling requirements are known, and target behavior is sufficiently specified to judge examples consistently.

## Context to inspect
Inspect source distributions, duplicates, synthetic-data generation methods, annotator guidance, language/domain balance, refusal examples, formatting conventions, and known benchmark contamination risks.

## Core knowledge
SFT quality depends more on signal quality and mixture design than raw volume. Demonstrations teach both content and latent style conventions. Duplicate and near-duplicate examples can overweight narrow behaviors. Synthetic data can scale coverage but can also amplify teacher-model artifacts. Senior curation separates correctness, desirability, diversity, and provenance rather than using a single quality score.

## Procedure
1. Define inclusion and exclusion criteria directly from the post-training objective.
2. Stratify required coverage by task, difficulty, language, domain, safety level, and conversation length.
3. Normalize schemas while preserving semantically important structure.
4. Remove exact duplicates and detect near-duplicates using semantic similarity plus targeted review.
5. Validate provenance, licensing, privacy, and consent constraints.
6. Score or review correctness independently from style quality.
7. Identify model-generated artifacts, templated phrasing, answer leakage, and suspiciously easy examples.
8. Add hard examples drawn from real failure modes and adversarial slices.
9. Balance routine examples against rare but high-impact behaviors.
10. Preserve a holdout set that is never used for training or selection.
11. Sample each major slice manually before finalizing the mixture.
12. Run small SFT pilots and inspect which examples dominate behavioral change.
13. Remove or down-weight examples correlated with undesirable regressions.
14. Version the dataset and record transformations reproducibly.

## Decision points
- Use synthetic demonstrations when human examples are scarce and outputs can be verified; prefer human-authored data for subtle policy, cultural, or preference judgments.
- Oversample rare critical behavior only enough to make it learnable; excessive oversampling can distort normal behavior.
- Preserve raw source data separately from cleaned training artifacts for auditability.

## Common failure patterns
- Treating more tokens as inherently better
- Mixing contradictory response styles
- Training on benchmark answers
- Allowing one source or generator to dominate
- Removing difficult examples because they look noisy
- Ignoring provenance or PII
- Evaluating on data too similar to training examples

## Verification
Check deduplication statistics, provenance coverage, distribution tables, slice counts, manual audit samples, contamination checks, and pilot-training effects. Verify the final holdout remains isolated from all training and data-selection steps.

## Expected output
A versioned, auditable instruction dataset with documented schema, provenance, quality rules, mixture weights, coverage metrics, holdouts, and known limitations.

## Stop conditions
Stop if provenance cannot be established for material data, sensitive information cannot be handled safely, target labels are contradictory, or contamination makes independent evaluation unreliable.