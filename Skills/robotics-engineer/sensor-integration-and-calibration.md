# Sensor Integration and Calibration

## Purpose
Integrate heterogeneous robot sensors with explicit coordinate frames, timing, calibration, uncertainty, and health checks so downstream estimation and autonomy can trust the data.

## When to use
Use when adding or replacing cameras, IMUs, encoders, LiDAR, radar, force/torque, proximity, GNSS, or other sensors; when measurements drift; or when cross-sensor alignment fails.

## Inputs
Sensor specifications, mounting geometry, interfaces, sample rates, timestamps, calibration targets, environmental constraints, expected noise, and consumer requirements.

## Preconditions
Hardware is safely powered and communication is available. Required calibration fixtures or reference measurements are available.

## Context to inspect
Drivers, frame tree, timestamp source, transport latency, units, coordinate conventions, firmware settings, calibration files, filtering, and downstream consumers.

## Core knowledge
Calibration may be intrinsic, extrinsic, temporal, bias-related, or scale-related. Accurate transforms do not compensate for stale timestamps, dropped samples, saturation, temperature drift, or inconsistent units.

## Procedure
1. Confirm electrical and protocol configuration.
2. Validate units, axes, handedness, ranges, and saturation behavior.
3. Establish authoritative timestamps and clock synchronization.
4. Measure sample jitter, transport delay, and drop rate.
5. Define sensor and robot coordinate frames.
6. Perform required intrinsic and extrinsic calibration.
7. Estimate bias/noise where applicable.
8. Store calibration with version, provenance, and hardware identity.
9. Exercise static and dynamic validation scenarios.
10. Add runtime health checks for stale data, saturation, implausible jumps, and calibration mismatch.

## Decision points
Use factory calibration when its accuracy and mounting assumptions are valid; otherwise perform in-system calibration. Prefer online recalibration only when observability and safety are sufficient.

## Common failure patterns
Axis inversion, millimeters-vs-meters errors, stale transforms, host-arrival timestamps, unsynchronized clocks, calibration copied across hardware units, and filtering that hides faults.

## Verification
Compare against independent references, residuals, repeatability tests, and dynamic scenarios. Verification must include timing as well as geometry.

## Expected output
Validated driver/configuration, calibration artifact, frame definitions, measured timing/noise characteristics, and health-check criteria.

## Stop conditions
Stop if mounting is unstable, timestamps cannot be trusted, reference equipment is inadequate, or calibration residuals exceed the system budget.