# Sensor Simulation and Noise Modeling

## Purpose
Build sensor simulations that reproduce information quality, timing, noise, dropout, and failure characteristics relevant to perception and control.

## When to use
Use for cameras, depth sensors, LiDAR, IMUs, encoders, force sensors, GPS, proximity sensors, or any virtual sensor driving robotics software.

## Inputs
Sensor datasheets, calibration data, synchronized robot logs, environment models, mounting transforms, update rates, downstream algorithm requirements.

## Preconditions
Coordinate frames and timing conventions must be defined.

## Context to inspect
Resolution, field of view, quantization, latency, jitter, bias, drift, saturation, occlusion, range limits, rolling shutter, exposure, packet loss, mounting errors, and environmental interference.

## Core knowledge
White Gaussian noise alone rarely captures production behavior. Bias, correlated drift, state-dependent error, timing error, clipping, missing data, and calibration uncertainty often dominate. A sensor model should preserve failure-relevant statistics without pretending to duplicate all hardware physics.

## Procedure
1. Identify downstream decisions affected by the sensor.
2. Establish clean ideal-sensor baseline behavior.
3. Measure error distributions from representative hardware logs.
4. Separate systematic bias, stochastic noise, temporal correlation, and dropout.
5. Model latency and timestamp behavior independently from measurement noise.
6. Add environment-dependent effects when evidence shows material impact.
7. Validate per-condition distributions and cross-sensor synchronization.
8. Test nominal, degraded, and failure states.
9. Version parameters by sensor/hardware revision.
10. Confirm downstream algorithms degrade similarly in simulation and reality.

## Decision points
Use empirical noise models when sufficient field data exists; use physics-based models when extrapolation across environments is required. Avoid expensive rendering effects unless they alter perception performance materially.

## Common failure patterns
Independent Gaussian noise for all errors; perfect timestamps; no saturation/dropout; incorrect frame conventions; calibration leakage from real data into test scenarios; tuning only aggregate RMSE.

## Verification
Compare distribution shape, bias, autocorrelation, dropout frequency, latency, saturation, and downstream perception/control metrics against held-out physical logs.

## Expected output
A versioned sensor model with statistical evidence, valid operating ranges, degradation modes, and known omissions.

## Stop conditions
Escalate when hardware logs are insufficient, sensor behavior changes materially by undocumented firmware, or simulation cannot represent a decision-critical failure mode.