# Error Mitigation

## Purpose
Reduce observable bias in noisy quantum experiments without confusing mitigation with fault tolerance.

## When to use
Use on near-term hardware after ideal correctness is established and when measurement quality is insufficient for the target observable.

## Inputs
Circuit family, target observables, noise characteristics, shot budget, calibration data, and acceptable estimator variance.

## Context to inspect
Readout calibration, backend drift, circuit depth, dominant noise, available mitigation methods, and sampling cost.

## Core knowledge
Error mitigation trades additional executions, modeling assumptions, or estimator variance for reduced bias. Techniques such as readout mitigation, zero-noise extrapolation, probabilistic cancellation, symmetry verification, and subspace filtering have different assumptions and costs.

## Procedure
1. Define the observable and unmitigated baseline.
2. Identify the dominant correctable bias.
3. Select a mitigation method whose assumptions are defensible.
4. Calibrate required auxiliary data close to execution time.
5. Budget additional circuits and shots.
6. Execute mitigated and control experiments.
7. Quantify bias reduction and variance increase.
8. Repeat across seeds, calibrations, or circuit instances.
9. Reject mitigation that improves one metric while destabilizing the estimator.
10. Record raw and mitigated data separately.

## Decision points
Use readout mitigation for measurement bias; use noise-scaling approaches only when noise can be scaled meaningfully. Prefer the simplest method that produces reproducible improvement.

## Common failure patterns
Reporting only mitigated results, hiding variance inflation, extrapolating outside supported regimes, mixing calibration windows, and claiming error correction.

## Verification
Compare against ideal simulation where feasible, evaluate confidence intervals, repeat independently, and verify improvement on held-out circuits.

## Expected output
Raw and mitigated estimates, uncertainty, method assumptions, execution overhead, and evidence of reproducible benefit.

## Stop conditions
Stop when mitigation assumptions are violated, variance becomes unusable, or hardware drift overwhelms the effect.