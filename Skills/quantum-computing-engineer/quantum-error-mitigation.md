# Quantum Error Mitigation

## Purpose
Reduce bias from noisy quantum execution without claiming fault tolerance, while quantifying additional sampling and model assumptions.

## When to use
Use on noisy hardware after baseline noise has been characterized and before interpreting small improvements as algorithmic signal.

## Inputs
Circuit family, raw results, calibration data, noise characteristics, shot budget, observable targets.

## Context to inspect
Readout error, gate error, drift, circuit depth, symmetry constraints, and compatibility with techniques such as readout mitigation, ZNE, PEC, or symmetry verification.

## Core knowledge
Mitigation trades bias for variance and cost. Techniques may fail under correlated, nonstationary, or model-mismatched noise.

## Procedure
1. Measure an unmitigated baseline with uncertainty.
2. Identify dominant error channels.
3. Choose mitigation methods with explicit assumptions.
4. Calibrate using time-adjacent measurements.
5. Apply one method at a time before combining techniques.
6. Track shot amplification and variance growth.
7. Validate on circuits with known expected values.
8. Compare mitigated and raw estimates with confidence intervals.
9. Recalibrate when drift is detected.

## Decision points
Use readout mitigation for measurable assignment bias; use extrapolation only when controllable noise scaling is credible. Avoid probabilistic cancellation when overhead is prohibitive.

## Common failure patterns
Reporting mitigated values without raw results, ignoring uncertainty amplification, stale calibration, and tuning mitigation on the evaluation target.

## Verification
Demonstrate reduced error on held-out known circuits and report total sampling/cost overhead.

## Expected output
A mitigation protocol with quantified assumptions, uncertainty, and benefit.

## Stop conditions
Stop when mitigation increases uncertainty beyond usefulness or calibration drift invalidates the correction model.