# Model Evaluation and Error Analysis

## Purpose
Evaluate vision systems using metrics and slices that reflect operational decisions, then convert failures into actionable engineering work.

## When to use
Use before promotion, after data/model changes, or when production quality degrades.

## Inputs
Predictions, ground truth, metadata, baseline, acceptance thresholds, business costs.

## Preconditions
Evaluation data is leakage-safe and representative.

## Context to inspect
Class/slice distributions, threshold policy, confidence scores, annotation uncertainty, previous failure taxonomy.

## Core knowledge
Aggregate metrics can hide severe subgroup failures. Operating thresholds should reflect error costs and production prevalence.

## Procedure
1. Reproduce baseline metrics.
2. Compute task-appropriate metrics and confidence intervals where useful.
3. Slice by environment, class, object size, device, and hard conditions.
4. Inspect false positives, false negatives, localization errors, and uncertainty.
5. Compare candidate vs baseline on identical samples.
6. Quantify regressions and improvements.
7. Cluster recurring failure modes.
8. Map each major failure to data, model, threshold, or system action.

## Decision points
Global vs per-class thresholds; aggregate vs worst-slice gates; metric optimization vs product-cost optimization.

## Common failure patterns
Test-set tuning, metric cherry-picking, no slice analysis, evaluating different sample sets, ignoring annotation ambiguity.

## Verification
Results must be reproducible from versioned predictions and manifests; sampled errors should match reported categories.

## Expected output
Evaluation report, slice table, failure taxonomy, and promotion recommendation.

## Stop conditions
Stop when evaluation integrity, ground truth, or sample provenance is doubtful.