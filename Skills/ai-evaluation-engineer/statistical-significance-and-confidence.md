# Statistical Significance and Confidence

## Purpose
Determine whether observed evaluation differences are likely to represent real system improvement rather than sampling noise.

## When to use
Use when comparing model versions, prompts, retrieval strategies, judges, or release candidates on stochastic or sampled evaluations.

## Inputs
- Per-example evaluation results
- Sample sizes and slices
- Metric definitions
- Baseline and candidate outputs
- Acceptable decision risk

## Context to inspect
Inspect paired versus independent samples, metric distribution, repeated runs, multiple comparisons, slice sizes, and whether test assumptions hold.

## Core knowledge
Senior evaluation work distinguishes effect size from statistical significance. Paired tests usually provide more power when the same examples are evaluated by both systems. Bootstrap confidence intervals are often practical for complex metrics. Small slices should not be overinterpreted.

## Procedure
1. Define the decision and minimum practically meaningful effect.
2. Prefer paired comparison on identical examples when possible.
3. Inspect metric distribution and dependence structure.
4. Choose an appropriate confidence interval or hypothesis test.
5. Bootstrap complex aggregate metrics when analytic assumptions are weak.
6. Report absolute difference, relative difference, effect size, and uncertainty.
7. Correct or explicitly account for repeated comparisons where necessary.
8. Analyze critical slices separately without hiding uncertainty.
9. Run sensitivity checks for outliers and scoring instability.
10. Distinguish inconclusive evidence from evidence of no difference.

## Decision points
Use confidence intervals when communicating plausible effect ranges; use hypothesis tests for explicit decision rules. Increase sample size when uncertainty overlaps the release threshold rather than forcing a binary conclusion.

## Common failure patterns
- Declaring wins from tiny score differences
- Ignoring pairing
- Reporting p-values without effect sizes
- Cherry-picking favorable slices
- Treating non-significance as equivalence

## Verification
Recompute results from raw per-example data, reproduce intervals with a fixed method, and confirm conclusions are stable under reasonable resampling choices.

## Expected output
A comparison report with effect sizes, uncertainty, statistical method, assumptions, and decision interpretation.

## Stop conditions
Stop when samples are too small, metrics are not comparable, or data dependence invalidates the chosen analysis without a defensible alternative.