# Training Evaluation Gates

## Purpose
Integrate evaluations into training so checkpoint selection and scale-up decisions are evidence-based and regression-aware.

## When to use
Use during pilot, intermediate checkpoint, final checkpoint, and scale-up decisions.

## Inputs
Checkpoint series, frozen evaluation suites, baseline scores, uncertainty estimates, safety tests, efficiency metrics.

## Context to inspect
Evaluation harness version, prompt templates, decoding settings, judge versions, sample counts, contamination status, and metric variance.

## Core knowledge
Checkpoint comparisons are invalid when harness settings drift. Multiple testing and noisy metrics can create false wins. Evaluation should distinguish development sets from protected final sets.

## Procedure
1. Freeze harness, prompts, decoding and scoring versions.
2. Establish baseline distributions and confidence intervals.
3. Define primary and guardrail gates before examining candidates.
4. Evaluate checkpoints at matched settings.
5. Analyze aggregate and critical slices.
6. Investigate statistically ambiguous deltas instead of overclaiming.
7. Check capability, safety, robustness and efficiency together.
8. Use protected tests sparingly for milestone decisions.
9. Record exact checkpoint-to-result lineage.
10. Approve scale-up only when predefined gates pass.

## Decision points
Increase sample size when expected effect is near measurement noise. Use human review for subjective or high-impact behaviors. Reject aggregate gains that conceal critical slice failures.

## Common failure patterns
Changing prompts between runs; selecting best of many noisy checkpoints without correction; evaluating only final loss; judge drift; repeated exposure to protected tests.

## Verification
A separate operator can rerun the harness and reproduce results within expected variance; every reported score maps to immutable checkpoint and harness versions.

## Expected output
A checkpoint comparison with pass/fail gates, uncertainty, slice analysis, and selection rationale.

## Stop conditions
Stop selection when harness drift, contamination, missing lineage, or contradictory safety results invalidate comparison.