# Accuracy and Drift Evaluation

## Purpose
Evaluate whether edge AI quality remains acceptable after model conversion, compression, hardware/runtime changes, sensor variation, and real-world distribution shift.

## When to use
Use before model releases, after quantization or runtime changes, when field behavior diverges from lab results, or when a fleet spans heterogeneous sensors and environments.

## Inputs
Reference model, deployed artifact, labeled evaluation sets, difficult-case subsets, field telemetry, model outputs, hardware/runtime cohorts, and quality thresholds.

## Preconditions
Define task metrics and operationally important slices before comparing models. Aggregate accuracy alone is insufficient for many products.

## Context to inspect
Training/evaluation preprocessing, calibration data, sensor revisions, confidence thresholds, class distributions, hardware precision, runtime versions, environment cohorts, and feedback/ground-truth availability.

## Core knowledge
Edge quality can regress from numerical conversion as well as data drift. Sensor aging, lighting, microphones, lens changes, firmware processing, location, and user behavior alter input distributions. Drift indicators are proxies; model changes should be gated by task-level evidence whenever labels are available.

## Procedure
1. Establish a trusted reference artifact and frozen evaluation protocol.
2. Compare source and deployed artifacts on identical golden samples.
3. Evaluate overall metrics plus safety-, rarity-, geography-, device-, and environment-relevant slices.
4. Measure calibration/confidence behavior where decisions depend on thresholds.
5. Segment field telemetry by model, hardware, firmware, and sensor cohort.
6. Monitor input/output distribution indicators that are privacy-compatible.
7. Investigate shifts before automatically retraining or changing thresholds.
8. Build labeled samples from changed conditions when policy permits.
9. Re-evaluate candidate fixes against baseline and regression slices.
10. Couple quality gates with latency, memory, and power gates for edge releases.
11. Define rollback criteria for significant quality regressions.

## Decision points
Use statistical drift detection for early warning, not as proof of quality loss. Retrain when changed real-world conditions are persistent and labeled evidence supports it. Adjust thresholds only when calibration analysis justifies the trade-off.

## Common failure patterns
Monitoring only average confidence, mixing hardware cohorts, blaming drift for preprocessing bugs, no frozen baseline, evaluating only common classes, and retraining on biased field samples.

## Verification
Run repeatable offline evaluation, device-level conformance tests, cohort analysis, and targeted labeled validation for suspected drift. Confirm release metrics remain inside approved limits.

## Expected output
A quality report and monitoring strategy that separates conversion regressions from real-world drift and defines evidence-based remediation.

## Stop conditions
Stop when evaluation data is not representative enough to support the decision, privacy rules prohibit required data collection, or regressions affect safety-critical behavior pending expert review.