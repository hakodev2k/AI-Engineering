# Quantum Error Mitigation

## Purpose
Apply error-mitigation techniques to noisy quantum experiments without overstating them as fault tolerance.

## When to use
Use on near-term noisy hardware when ideal simulation is insufficient and mitigation overhead is justified. Do not use mitigation to hide a fundamentally unsuitable circuit.

## Inputs
Target circuit, backend noise profile, observable, shot budget, baseline result, and acceptable uncertainty.

## Preconditions
The unmitigated result and ideal/reference result are measurable for representative cases.

## Context to inspect
Readout error, circuit depth, noise scaling options, symmetries, repeated-measurement cost, and calibration freshness.

## Core knowledge
Mitigation trades additional experiments, assumptions, and estimator variance for lower bias. Techniques such as measurement mitigation, zero-noise extrapolation, symmetry verification, probabilistic cancellation, and randomized compiling have different applicability and cost.

## Procedure
1. Measure the unmitigated baseline.
2. Identify dominant error sources relevant to the observable.
3. Select the least-complex applicable mitigation technique.
4. Define extra circuit and shot overhead.
5. Calibrate mitigation inputs in the same execution window.
6. Run mitigated and control experiments.
7. Compute uncertainty, not only point estimates.
8. Check that mitigation improves error across multiple instances.
9. Measure cost versus accuracy gain.
10. Document assumptions and cases where mitigation worsens results.

## Decision points
Use measurement mitigation for readout-dominated error; use noise extrapolation only when controllable noise scaling is credible; use symmetry checks when conserved quantities are valid for the algorithm.

## Common failure patterns
Cherry-picking improved runs, omitting uncertainty, reusing stale calibration matrices, stacking techniques without isolating benefit, and calling mitigation error correction.

## Verification
Compare absolute/relative error and confidence intervals against unmitigated and ideal references across repeated instances.

## Expected output
Mitigation configuration, before/after metrics, overhead, uncertainty, limitations, and reproducible run metadata.

## Stop conditions
Stop when mitigation overhead exceeds value, assumptions are violated, or confidence intervals do not show consistent improvement.