# Model Evaluation and Error Analysis

## Purpose
Determine where a model succeeds, fails, and whether aggregate metrics hide unacceptable behavior.

## When to use
Before promotion, after experiments, and during production regressions.

## Inputs
Predictions, labels, metrics, cohorts, baseline outputs, confidence scores, business error costs.

## Context to inspect
Class distribution, thresholding, calibration, temporal slices, important cohorts, high-cost examples, annotation uncertainty.

## Core knowledge
Evaluation should answer operational questions. Aggregate averages can conceal rare but severe failures. Error analysis should drive the next data/model decision.

## Procedure
1. Compute primary and guardrail metrics against baselines.
2. Add confidence intervals or repeated-run variance.
3. Slice results by time, cohort, class, and relevant feature ranges.
4. Inspect confusion patterns and representative errors.
5. Separate data, label, model, threshold, and product failures.
6. Analyze calibration and threshold trade-offs when probabilities drive decisions.
7. Prioritize error clusters by frequency and impact.
8. Convert findings into targeted experiments.

## Decision points
Tune thresholds when ranking is adequate but operating point is wrong; improve data when errors cluster around coverage/labels; change model when representation is limiting.

## Common failure patterns
Reporting one metric, cherry-picking slices, optimizing on test examples, and treating annotation ambiguity as model error.

## Verification
Findings reproduce from stored predictions; priority errors have evidence and proposed remediation.

## Expected output
Evaluation report with baselines, slices, uncertainty, error taxonomy, and next actions.

## Stop conditions
Stop when labels or split validity are compromised enough to invalidate conclusions.