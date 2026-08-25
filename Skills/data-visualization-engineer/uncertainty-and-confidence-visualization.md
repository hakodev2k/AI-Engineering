# Uncertainty and Confidence Visualization

## Purpose
Communicate estimation error, variability, forecast ranges, and data limitations without implying false precision.

## When to use
For forecasts, sampled estimates, experiments, model outputs, noisy measurements, or incomplete data.

## Inputs
Point estimates, interval definitions, sample sizes, model assumptions, uncertainty source, decision thresholds.

## Core knowledge
Aleatoric variability, sampling error, and model uncertainty are different. Intervals require clear semantics. Visual confidence should not be encoded as certainty when assumptions are weak.

## Procedure
1. Identify the source and interpretation of uncertainty.
2. Determine which uncertainty matters to the decision.
3. Compute or obtain defensible intervals or distributions.
4. Choose bands, error bars, quantile plots, ensembles, or distributions appropriate to the task.
5. Label interval meaning and confidence/credible level.
6. Avoid excessive decimal precision.
7. Show sample size or coverage limitations where material.
8. Distinguish observed values from forecasts and estimates.
9. Test whether users can explain the uncertainty correctly.

## Decision points
Use intervals for compact comparison, distributions for shape, and scenario/ensemble views when multiple plausible trajectories matter. Do not fabricate intervals when the underlying method cannot support them.

## Common failure patterns
Unlabeled error bars; treating prediction and confidence intervals as equivalent; hiding uncertainty to simplify visuals; false precision; using opacity without explanation.

## Verification
Recompute representative intervals and test interpretation with users or reviewers unfamiliar with the implementation.

## Expected output
A visualization that states estimate, uncertainty semantics, assumptions, and limitations clearly.

## Stop conditions
Stop when uncertainty cannot be quantified or characterized responsibly; communicate that limitation instead of inventing precision.