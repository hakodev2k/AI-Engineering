# Statistical Inference

## Purpose
Draw calibrated conclusions from samples while making uncertainty, assumptions, and practical significance explicit.

## When to use
Use for estimation, hypothesis testing, uncertainty intervals, group comparisons, and evidence-based decisions.

## Inputs
Question, estimand, sample, sampling process, candidate model, and decision threshold.

## Context to inspect
Independence structure, clustering, repeated measures, selection, censoring, distribution shape, and multiple testing.

## Core knowledge
Confidence intervals, likelihood, Bayesian posterior uncertainty, power, effect size, and p-values answer different questions. Statistical significance is not practical significance. Assumption violations can dominate nominal precision.

## Procedure
1. Define the estimand before selecting a test.
2. Describe sampling and dependence structure.
3. Choose an estimator and uncertainty method compatible with the data.
4. Check model assumptions and robustness.
5. Estimate effect size with intervals.
6. Correct or control for multiple comparisons when applicable.
7. Run sensitivity analyses for plausible alternatives.
8. Translate statistical evidence into decision-relevant terms.
9. Document assumptions and unresolved uncertainty.

## Decision points
Use parametric methods when assumptions are defensible and useful; use robust, resampling, or hierarchical approaches when structure demands them. Bayesian methods are useful when prior information and posterior decisions are meaningful.

## Common failure patterns
P-value worship, post-hoc hypothesis selection, ignoring clustering, interpreting confidence intervals as posterior probabilities, and reporting precision unsupported by data quality.

## Verification
Reproduce estimates independently, inspect diagnostics, and confirm conclusions are not artifacts of one arbitrary specification.

## Expected output
An inferential result with estimand, effect size, uncertainty, assumptions, diagnostics, and decision interpretation.

## Stop conditions
Stop when sampling bias, confounding, or dependence invalidates the intended inference and cannot be addressed.