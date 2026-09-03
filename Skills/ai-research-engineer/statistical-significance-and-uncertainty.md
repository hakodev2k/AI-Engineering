# Statistical Significance and Uncertainty

## Purpose
Quantify uncertainty in AI research results so decisions are based on effects that are distinguishable from sampling noise, seed variance, evaluator variance, and repeated experimentation.

## When to use
Use when comparing models or methods, aggregating benchmark scores, reporting improvements, evaluating stochastic systems, or deciding whether an observed gain is reliable enough to justify further investment.

## Inputs
- Per-example or per-run measurements
- Experimental design
- Seed or repetition metadata
- Primary metric
- Minimum practically meaningful effect
- Known dependencies between observations

## Preconditions
Confirm that the statistical unit matches the research question. Do not treat correlated examples, repeated samples from one item, or checkpoints from one training run as independent observations without justification.

## Context to inspect
Inspect sample sizes, metric distributions, class imbalance, paired observations, repeated measures, seed variance, evaluator variance, multiple comparisons, stopping rules, missing/failed runs, and whether the metric is bounded or heavy-tailed.

## Core knowledge
Statistical significance is not practical significance. Confidence intervals, effect sizes, paired tests, bootstrap procedures, hierarchical models, and permutation tests are tools for different data structures. Multiple adaptive experiments increase false-positive risk. Large benchmark sample counts do not remove training-seed uncertainty when only one model run was evaluated.

## Procedure
1. Define the effect being estimated and the correct unit of analysis.
2. State the minimum improvement that would change the technical decision.
3. Identify sources of randomness: data sampling, training seed, decoding, human judges, model judges, or infrastructure.
4. Prefer paired analysis when the same examples are evaluated by both methods.
5. Inspect distributions and choose an uncertainty method consistent with metric properties.
6. Use bootstrap or permutation methods when parametric assumptions are doubtful.
7. Report confidence or credible intervals alongside point estimates.
8. Estimate seed-to-seed variation for training-sensitive claims.
9. Correct or explicitly account for multiple comparisons when many hypotheses or benchmarks are tested.
10. Avoid optional stopping based solely on temporary significance.
11. Perform sensitivity analysis for alternative reasonable statistical choices.
12. Distinguish statistically detectable, practically meaningful, and inconclusive effects.

## Decision points
- Use paired bootstrap for many per-example model comparisons when observations can be paired.
- Use hierarchical or mixed approaches when variation exists at both run and example levels.
- Increase independent runs when between-training variance dominates.
- Prefer an inconclusive conclusion over a directional claim when intervals include effects that would reverse the decision.

## Common failure patterns
- Reporting only p-values.
- Treating thousands of benchmark items as independent evidence about training stability.
- Selecting the best seed and discarding others.
- Running many comparisons and highlighting only significant ones.
- Confusing narrow confidence intervals with an unbiased metric.
- Ignoring failed runs from unstable methods.

## Verification
Analysis is implemented when effect sizes and uncertainty are computed. It is verified when the statistical unit is defensible, assumptions are documented, repeated-run variance is represented when relevant, multiple testing is handled, and conclusions remain consistent under reasonable sensitivity checks.

## Expected output
Effect estimates, uncertainty intervals, statistical methodology, practical-significance thresholds, sensitivity analysis, and a decision classification of supported, unsupported, or inconclusive.

## Stop conditions
Stop when observations cannot be mapped to a defensible statistical unit, missing data are systematically biased, sample size cannot resolve practically important effects, or adaptive experiment history makes a confirmatory claim invalid without fresh evaluation.