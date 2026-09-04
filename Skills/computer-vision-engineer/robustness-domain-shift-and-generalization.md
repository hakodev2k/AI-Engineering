# Robustness, Domain Shift, and Generalization

## Purpose
Identify and mitigate performance degradation caused by changes in cameras, environments, populations, acquisition pipelines, or operating conditions.

## When to use
Use before cross-domain launches, after production drift, when validation performance does not transfer, or when new devices/regions/conditions are introduced.

## Inputs
Source and target samples, metadata, baseline model, slice metrics, production telemetry, capture specifications, and retraining constraints.

## Preconditions
The target deployment domain can be sampled or characterized with credible evidence.

## Context to inspect
Inspect camera models, resolution, optics, lighting, weather, geography, backgrounds, compression, preprocessing, class prevalence, annotation conventions, and temporal change.

## Core knowledge
Covariate shift, label shift, concept drift, shortcut learning, calibration drift, and out-of-distribution inputs require different responses. Robustness should be measured on explicit perturbations and real target-domain slices, not inferred from augmentation alone.

## Procedure
1. Define the deployment domains and expected variation.
2. Compare source and target data statistics and visual samples.
3. Measure baseline quality and calibration by domain slice.
4. Classify failures as capture, preprocessing, representation, label, or concept issues.
5. Build targeted holdouts for recurring shift dimensions.
6. Test realistic perturbations without treating them as substitutes for target data.
7. Add representative target data or adaptation only where evidence supports it.
8. Re-evaluate source-domain regression after adaptation.
9. Test confidence/OOD signals for severe unsupported conditions.
10. Define fallback or abstention behavior where errors are costly.
11. Add domain telemetry and launch gates.
12. Preserve shifted examples as regression tests.

## Decision points
Prefer collecting representative data over increasingly synthetic augmentation when the shift is known. Use domain-specific models only when one shared model cannot meet requirements and operational complexity is justified.

## Common failure patterns
Calling random augmentation robustness, adapting on the test set, ignoring calibration drift, conflating label-policy changes with model drift, and silently degrading the original domain.

## Verification
Verify source and target slice metrics, calibration, regression limits, OOD/fallback behavior where used, and target-domain production shadow results.

## Expected output
A documented shift taxonomy, robustness evaluation, mitigation strategy, fallback policy, and monitoring plan.

## Stop conditions
Stop if target-domain evidence is unavailable, the label concept changed without a new specification, or deployment would exceed defined safety/error limits.