# Noise Modeling

## Purpose
Model quantum hardware noise well enough to predict failure modes, compare designs, and prioritize mitigations without pretending the model is the device.

## When to use
Use for pre-hardware studies, backend comparison, algorithm robustness analysis, and explaining divergence between ideal simulation and physical execution.

## Inputs
Backend calibration, gate durations, error rates, coherence data, readout errors, circuit structure, and experimental observations.

## Context to inspect
Noise channels supported by the simulator, calibration timestamp, crosstalk evidence, drift, gate-dependent errors, leakage, and measurement behavior.

## Core knowledge
Real hardware noise is nonstationary and may be correlated. Depolarizing, amplitude-damping, phase-damping, coherent, readout, and leakage models capture different mechanisms. A simple model is useful only when its assumptions match the question.

## Procedure
1. Define the prediction or comparison the model must support.
2. Establish ideal noiseless behavior.
3. Gather current backend calibration and experimental evidence.
4. Add dominant noise channels first.
5. Keep independent errors separate from correlated effects.
6. Compare simulated distributions with hardware results.
7. Tune only parameters supported by evidence.
8. Run sensitivity analysis to identify dominant mechanisms.
9. Record unsupported effects explicitly.
10. Revalidate after calibration or hardware changes.

## Decision points
Prefer simple interpretable models for design exploration; use richer correlated models only when evidence shows simpler assumptions fail.

## Common failure patterns
Using stale calibration, treating average gate error as a complete model, fitting noise to one circuit, ignoring coherent errors, and claiming hardware prediction from an unvalidated simulator.

## Verification
Compare model predictions with independent circuits and hardware data; report residual error and sensitivity to parameters.

## Expected output
A documented noise model, validation evidence, dominant-noise assessment, and known limitations.

## Stop conditions
Stop when calibration is unavailable, drift invalidates measurements, or unexplained discrepancies make the model unsuitable for decisions.