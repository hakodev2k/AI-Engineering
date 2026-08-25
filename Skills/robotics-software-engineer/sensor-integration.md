# Sensor Integration

## Purpose
Integrate cameras, IMUs, encoders, LiDAR, GNSS, force sensors, and other devices into a robotics stack with correct timing, frames, units, health reporting, and failure behavior.

## When to use
Use when adding or replacing a sensor, diagnosing corrupted measurements, or standardizing device drivers.

## Inputs
- Sensor datasheet and protocol
- Driver/API documentation
- Sample raw data
- Clock and synchronization architecture
- Coordinate-frame conventions
- Expected rates and accuracy

## Preconditions
Confirm electrical connectivity and supported transport before treating symptoms as software defects.

## Context to inspect
Inspect driver code, firmware versions, bus configuration, timestamps, frame IDs, calibration files, units, message rates, diagnostics, and downstream assumptions.

## Core knowledge
Senior integration requires understanding sampling, aliasing, latency, jitter, device clocks, timestamp provenance, transport loss, units, saturation, quantization, covariance, calibration, and coordinate frames.

## Procedure
1. Define the physical quantity and required performance.
2. Validate transport, firmware, and device configuration.
3. Capture raw samples before transformations.
4. Establish timestamp source and clock relationship.
5. Normalize units and coordinate conventions.
6. Attach correct frame identifiers and covariance where meaningful.
7. Validate expected range, noise, saturation, and dropout behavior.
8. Add health metrics for rate, latency, stale data, and device faults.
9. Test reconnect, restart, unplug, and degraded conditions.
10. Compare measurements against an independent reference.
11. Document calibration and configuration dependencies.

## Decision points
Timestamp at acquisition when possible rather than arrival. Preserve raw data when downstream debugging or recalibration is valuable. Reject stale data rather than silently reusing it when control safety depends on freshness.

## Common failure patterns
- Host arrival time mistaken for capture time
- Wrong units or axis signs
- Silent frame mismatch
- Ignoring device warm-up or saturation
- No diagnostics for dropped packets
- Driver retries that block control threads

## Verification
Measure rate, timestamp monotonicity, latency, noise, physical plausibility, frame correctness, reconnect behavior, and downstream compatibility.

## Expected output
A sensor path with documented timing, frames, units, calibration, diagnostics, and fault behavior.

## Stop conditions
Stop if device specifications cannot satisfy system requirements, timestamp provenance is unknowable, calibration evidence is missing for safety-critical use, or electrical/firmware faults require specialist intervention.