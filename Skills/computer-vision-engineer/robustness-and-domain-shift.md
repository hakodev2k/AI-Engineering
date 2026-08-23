# Robustness and Domain Shift

## Purpose
Assess and improve vision behavior under realistic changes in lighting, weather, camera, geography, compression, scene composition, and other deployment conditions.

## When to use
Use before expansion to new environments, after drift incidents, or when aggregate validation hides brittle behavior.

## Inputs
Baseline model, representative slices, deployment metadata, known nuisance factors, quality thresholds.

## Preconditions
Target domains and important operational conditions are enumerated.

## Context to inspect
Device generations, optics, regions, time-of-day, weather, backgrounds, resolution, compression, rare conditions.

## Core knowledge
Robustness comes primarily from representative data and explicit evaluation. Synthetic corruption tests reveal sensitivity but do not replace real target-domain evidence.

## Procedure
1. Define high-risk domain shifts and invariances.
2. Build evaluation slices for each condition.
3. Measure baseline degradation and confidence behavior.
4. Separate capture/pipeline issues from model errors.
5. Add targeted real or validated synthetic data.
6. Compare augmentation, adaptation, and retraining strategies.
7. Recheck original-domain regressions.
8. Define supported-domain limits and fallback behavior.

## Decision points
General model vs domain-specific variants; augmentation vs new data; adaptation vs full retraining.

## Common failure patterns
Random corruptions presented as production proof, unsupported domain extrapolation, fixing one slice while regressing another, no device-level analysis.

## Verification
Verify target-slice metrics, original-domain retention, confidence behavior, and end-to-end tests under real representative conditions.

## Expected output
Robustness matrix, remediation evidence, supported-domain statement, and residual risks.

## Stop conditions
Stop when the target domain lacks enough trustworthy samples or required performance remains infeasible.