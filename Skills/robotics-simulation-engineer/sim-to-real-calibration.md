# Sim-to-Real Calibration

## Purpose
Calibrate simulation parameters against physical robot evidence so virtual results predict task-relevant behavior within known uncertainty.

## When to use
Use before trusting simulation for controller tuning, policy transfer, performance prediction, or regression analysis after hardware changes.

## Inputs
Synchronized physical logs, simulator traces, model parameters, calibration experiments, uncertainty bounds, target observables.

## Preconditions
Data acquisition must be trustworthy and simulator/robot configurations must correspond to the same hardware revision.

## Context to inspect
Mass/inertia, friction, actuator response, sensor bias, delays, compliance, contact, controller settings, environmental conditions, and measurement calibration.

## Core knowledge
Calibration is an inverse problem and many parameter sets can explain the same trajectory. Prefer isolated experiments that make parameters identifiable, use held-out validation, and report uncertainty rather than one magic parameter set.

## Procedure
1. Choose observables tied to intended simulation use.
2. Design isolated calibration experiments for parameter groups.
3. Align physical and simulated coordinate/time references.
4. Establish baseline error before tuning.
5. Estimate parameters using bounded optimization or system identification.
6. Inspect parameter identifiability and correlations.
7. Validate on experiments not used for fitting.
8. Test full-task trajectories and failure boundaries.
9. Quantify residual error and uncertainty.
10. Version calibration results with hardware and simulator revisions.

## Decision points
Prefer measured parameters when reliable; fit effective parameters when unmodeled phenomena make nominal values insufficient. Reject extra model complexity unless it improves held-out prediction materially.

## Common failure patterns
Fitting and validating on the same trajectory; compensating one wrong parameter with another; time misalignment; optimizing only task success; ignoring confidence intervals; silently recalibrating after regressions.

## Verification
Demonstrate improved held-out agreement across multiple operating conditions and confirm fitted values remain physically plausible. Distinguish successful optimization from validated prediction.

## Expected output
A calibration report and parameter set containing experiment provenance, residual errors, confidence/uncertainty ranges, and valid operating envelope.

## Stop conditions
Stop when parameter identifiability is inadequate, reference measurements are unreliable, or residual errors reveal missing decision-critical physics.