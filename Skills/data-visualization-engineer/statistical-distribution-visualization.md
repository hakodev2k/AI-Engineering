# Statistical Distribution Visualization

## Purpose
Reveal spread, skew, multimodality, outliers, and subgroup differences that summary statistics can conceal.

## When to use
When averages or totals are insufficient for understanding variability or risk.

## Inputs
Quantitative observations, grouping variables, sample sizes, domain thresholds.

## Core knowledge
Histograms depend on binning; boxplots compress shape; violin and density plots depend on smoothing; empirical distributions retain more information. Sample size and unequal group sizes affect interpretation.

## Procedure
1. Inspect sample size, range, skew, and discreteness.
2. Decide whether users need shape, quantiles, individual observations, or threshold exceedance.
3. Select histogram, ECDF, boxplot, density, strip, or combined view accordingly.
4. Use consistent scales for subgroup comparisons.
5. Choose defensible bin widths or smoothing parameters.
6. Show sample size when it affects confidence.
7. Treat outliers as observations to investigate, not automatically remove.
8. Add domain thresholds or reference distributions when useful.
9. Test whether aggregation masks important tails or modes.

## Decision points
Prefer ECDF for precise cumulative comparison, histogram for familiar shape inspection, and boxplots for compact many-group summaries. Show raw points when sample sizes are manageable.

## Common failure patterns
Arbitrary bins; clipped tails; unequal axes across groups; hiding outliers; interpreting density height as counts; comparing groups without sample sizes.

## Verification
Recalculate quantiles and counts from source data and verify visual behavior under alternate reasonable binning or smoothing choices.

## Expected output
A distribution view with explicit transformation, scale, sample-size, and outlier treatment.

## Stop conditions
Stop when filtering or sampling materially changes the distribution but its mechanism cannot be established.