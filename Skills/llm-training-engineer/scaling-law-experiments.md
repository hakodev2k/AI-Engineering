# Scaling-Law Experiments

## Purpose
Use smaller controlled runs to estimate how loss, capability, and efficiency change with model size, data, and compute before committing to expensive scale.

## When to use
Use for model-family planning, token-budget decisions, architecture comparison, and compute allocation.

## Inputs
Candidate model sizes, data budgets, compute estimates, fixed tokenizer/data recipes, evaluation suites, hardware throughput measurements.

## Context to inspect
Whether experiments share architecture family, data quality, optimizer recipe, context, batch regime, and evaluation settings.

## Core knowledge
Scaling fits are only as valid as their experimental controls and range. Extrapolation far beyond observed scales is risky. Loss scaling may not predict every downstream capability or safety behavior.

## Procedure
1. Define the decision the scaling study must inform.
2. Select several log-spaced model/data/compute points.
3. Hold irrelevant variables fixed.
4. Tune enough to avoid handicapping particular scales.
5. Measure training loss, downstream metrics, throughput and actual compute.
6. Fit candidate relationships and inspect residuals.
7. Quantify uncertainty and sensitivity to excluded points.
8. Compare predicted optimum against operational constraints.
9. Validate with an intermediate-scale holdout run.
10. Record assumptions and extrapolation range.

## Decision points
Use more experiment points when residuals show regime changes. Prefer empirical intermediate validation before a major scale jump. Treat capability thresholds separately when smooth loss fits do not explain them.

## Common failure patterns
Two-point extrapolation; mixing data recipes; using theoretical instead of actual compute; assuming loss fit predicts all evaluations; ignoring optimizer under-tuning at larger scales.

## Verification
Fits reproduce held-out intermediate results within stated uncertainty and all experiment configurations are traceable and comparable.

## Expected output
A scaling study with fitted relationships, uncertainty, recommended operating point, and explicit limitations.

## Stop conditions
Stop extrapolation when residuals are unstable, experiment controls differ materially, or predicted scale lies far outside validated range without a validation step.