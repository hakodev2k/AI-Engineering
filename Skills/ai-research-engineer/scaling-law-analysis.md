# Scaling Law Analysis

## Purpose
Analyze how model quality, loss, cost, and bottlenecks change with model size, data volume, compute, context, or inference budget so larger experiments are planned from evidence rather than intuition.

## When to use
Use when deciding whether to scale a promising method, allocating compute between model and data, estimating returns from larger training runs, or comparing methods whose advantages may change with scale.

## Inputs
- Results across multiple scales
- Model parameter counts or active parameter counts
- Training tokens/examples
- Compute estimates
- Evaluation metrics or losses
- Hardware/runtime measurements

## Preconditions
Experiments across scales must be sufficiently comparable in data quality, optimization, architecture family, and evaluation. Define the quantity being scaled and the outcome being modeled.

## Context to inspect
Inspect effective batch size, optimizer schedules, training duration, data reuse, model width/depth changes, sparsity, precision, hardware efficiency, checkpoint selection, and whether smaller runs were undertrained or overtrained.

## Core knowledge
Empirical scaling curves are local models, not universal laws. Power-law behavior may hold only within a regime, and architecture or data changes can create breaks. Compute-optimal scaling differs from simply maximizing parameter count. Downstream capability can show thresholds or saturation even when training loss scales smoothly.

## Procedure
1. Define the independent scaling variables and target dependent metrics.
2. Verify that run configurations differ only in intended scale-related ways.
3. Normalize training budget using tokens, FLOPs, wall-clock, or cost as appropriate.
4. Plot raw measurements before fitting any functional form.
5. Identify obvious regime changes, saturation, instability, or data-reuse effects.
6. Fit simple candidate relationships such as power laws only over defensible ranges.
7. Estimate uncertainty in fitted parameters and extrapolations.
8. Compare predicted and observed held-out scale points.
9. Evaluate downstream tasks in addition to training/validation loss when capability matters.
10. Measure efficiency effects such as utilization, communication, and memory that may distort nominal compute.
11. Compare competing methods at matched compute, matched size, and matched quality where useful.
12. Use the curve to estimate the smallest next experiment that can test the extrapolation.
13. Update the model whenever new scale points materially change the fit.

## Decision points
- Scale further only when projected gain justifies cost and uncertainty.
- Add data rather than parameters when evidence indicates data limitation.
- Treat extrapolation beyond observed scale cautiously, especially across architecture or data-regime changes.
- Use downstream capability curves when a lower training loss does not reliably predict the target behavior.

## Common failure patterns
- Fitting a power law to too few points.
- Mixing undertrained and compute-optimal models.
- Ignoring data quality changes across scale.
- Equating theoretical FLOPs with delivered compute.
- Extrapolating across a regime change without evidence.
- Claiming a scaling advantage from one favorable scale.

## Verification
Analysis is implemented when scale measurements and fitted relationships are recorded. It is verified when configurations are comparable, uncertainty is reported, at least one scale point tests extrapolation where feasible, operational efficiency is accounted for, and conclusions are stable under reasonable fit choices.

## Expected output
Scaling plots or tables, fit parameters with uncertainty, regime notes, compute/data/model trade-offs, extrapolation limits, and a recommended next scale experiment.

## Stop conditions
Stop when runs are not comparable, too few scale points exist for a defensible trend, infrastructure efficiency changes dominate the curve, or extrapolation uncertainty is too high to support the intended compute decision.