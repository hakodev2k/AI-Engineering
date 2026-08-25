# Negative Sampling

## Purpose
Construct informative negatives for implicit-feedback recommendation without distorting the learning problem.

## When to use
Use when positives are sparse relative to unobserved user-item pairs.

## Inputs
Exposure logs, positive labels, candidate sets, sampling budget, item popularity, and timestamps.

## Context to inspect
Which items were actually exposable, ranking positions, inventory availability, repeated impressions, and hard-negative sources.

## Core knowledge
Unobserved does not mean disliked. Sampling changes the effective training distribution and may require weighting. Hard negatives improve discrimination but can introduce false negatives.

## Procedure
1. Define eligible negatives at each decision time.
2. Prefer exposed-but-not-engaged examples when semantics support them.
3. Add sampled unexposed negatives only with documented assumptions.
4. Mix random/popularity/hard negatives deliberately.
5. Prevent positives from appearing as negatives within attribution windows.
6. Apply sampling weights when estimating population objectives.
7. Tune ratios based on metric and compute behavior.
8. Analyze cohorts for false-negative risk.

## Decision points
Use harder negatives as models mature; retain easy negatives for calibration and coverage. Choose in-batch negatives only when cross-example negatives are semantically valid.

## Common failure patterns
Future positives labeled negative, sampling unavailable items, popularity distortion, duplicate negatives, and uncontrolled hard-negative mining.

## Verification
Audit sampled examples, compare label distributions, run sensitivity tests across strategies, and verify no temporal leakage.

## Expected output
A deterministic, versioned negative-sampling policy with measured impact.

## Stop conditions
Stop if eligibility or exposure cannot be reconstructed well enough to define defensible negatives.