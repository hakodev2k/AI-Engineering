# Robustness and Perturbation Testing

## Purpose
Evaluate whether AI behavior remains acceptably stable under harmless variations in wording, formatting, ordering, noise, and context.

## When to use
Use when the same user intent can appear in many forms or when minor input changes may cause large output changes.

## Inputs
Baseline cases, perturbation rules, expected invariants, model configuration, and acceptance thresholds.

## Preconditions
The intended semantic equivalence of perturbations is defensible.

## Context to inspect
Inspect preprocessing, normalization, prompt templates, token limits, language handling, retrieval, and model settings.

## Core knowledge
Robustness testing distinguishes meaningful sensitivity from accidental brittleness. Perturbations can include paraphrase, whitespace, punctuation, casing, ordering, typos, irrelevant context, language variation, and benign distractors.

## Procedure
1. Select representative baseline cases.
2. Define invariants that should survive benign transformations.
3. Generate controlled perturbation families.
4. Run baseline and variants under pinned configuration.
5. Compare hard-contract outcomes and quality metrics.
6. Measure variance within each perturbation family.
7. Investigate large behavioral flips.
8. Separate legitimate semantic changes from brittleness.
9. Add high-value brittle cases to regression tests.
10. Repeat after prompt or model changes.

## Decision points
Require strict stability for safety, authorization, structured contracts, and critical extraction. Allow bounded stylistic variance for open-ended generation.

## Common failure patterns
Using uncontrolled paraphrases, assuming all textual variation is semantically equivalent, reporting only averages, and ignoring rare catastrophic flips.

## Verification
Confirm perturbations preserve intended meaning and critical invariants remain within specified thresholds.

## Expected output
A robustness report with variance metrics, brittle cases, root-cause hypotheses, and regression additions.

## Stop conditions
Stop when perturbation validity cannot be established or discovered instability crosses a protected safety boundary.