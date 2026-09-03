# Quality Scoring and Filtering

## Purpose
Design and operate quality signals that remove harmful or low-value data without collapsing useful diversity or encoding hidden model preferences.

## When to use
Use when a corpus is noisy, heterogeneous, web-derived, synthetic, or too large to review manually.

## Inputs
Dataset samples, task definition, quality rubric, candidate heuristics or classifiers, source metadata, and evaluation slices.

## Context to inspect
Inspect downstream model goals, language and domain distributions, previous filtering rules, human review decisions, source-level quality differences, and protected rare cases.

## Core knowledge
Quality is multidimensional: correctness, coherence, informativeness, formatting, source reliability, safety, and task relevance can conflict. Automated scores are proxies and can amplify bias. Filters should be calibrated on reviewed examples and audited per slice.

## Procedure
1. Define explicit quality dimensions and unacceptable defects.
2. Build a stratified reviewed sample.
3. Measure simple deterministic heuristics first.
4. Add learned or model-based scorers only where heuristics are insufficient.
5. Calibrate thresholds against human judgments.
6. Combine signals with transparent rules or validated ranking logic.
7. Measure acceptance rates by source, language, domain, and difficulty.
8. Inspect false positives and false negatives.
9. Preserve scores and rejection reasons for auditability.
10. Recalibrate when sources or target tasks change.

## Decision points
Use hard filters for clear policy or corruption violations. Prefer ranking or weighted sampling for ambiguous quality where binary rejection would erase diversity. Avoid using a single large model score as an unquestioned ground truth.

## Common failure patterns
- Filtering by perplexity alone
- Penalizing minority language styles
- Hiding rejection reasons
- Calibrating on unrepresentative samples
- Allowing scorer drift to silently alter mixture composition

## Verification
Implemented means every record receives reproducible quality decisions. Verified means reviewed precision/recall is acceptable and filtering improves downstream metrics without unexplained slice regressions.

## Expected output
A versioned scoring pipeline, thresholds, calibration evidence, rejection taxonomy, and slice-level impact report.

## Stop conditions
Stop when no defensible quality rubric exists, scorer bias materially harms required slices, or filtering changes cannot be traced and reproduced.