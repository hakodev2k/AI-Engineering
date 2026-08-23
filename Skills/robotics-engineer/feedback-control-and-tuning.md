# Feedback Control and Tuning

## Purpose
Design and tune feedback controllers that track commands with adequate stability, accuracy, disturbance rejection, and actuator margin.

## When to use
Use for position, velocity, force, heading, balance, or other regulated robot variables; or when oscillation, lag, overshoot, or poor disturbance rejection appears.

## Inputs
Plant behavior, control rate, actuator limits, sensor noise, latency, command profile, stability/performance requirements.

## Preconditions
Signals, units, actuator direction, and timing are verified; safety limits exist for testing.

## Context to inspect
Controller structure, gains, filters, feedforward, saturation, anti-windup, command shaping, sampling jitter, mechanical compliance.

## Core knowledge
Closed-loop behavior depends on plant dynamics, sample delay, gain/phase margin, nonlinearities, saturation, and measurement noise. Integral action removes steady error but can wind up; derivative action amplifies noise.

## Procedure
1. Define controlled variable, reference, and measurable disturbances.
2. Validate open-loop sign and actuator response at safe amplitude.
3. Measure or identify dominant plant dynamics.
4. Select controller structure appropriate to the plant.
5. Establish conservative gains and explicit saturation.
6. Tune proportional response, then integral/derivative or feedforward as justified.
7. Add anti-windup and filtering without hiding instability.
8. Test steps, ramps, disturbances, payload changes, and command reversals.
9. Measure tracking error, overshoot, settling, oscillation, and actuator usage.
10. Document valid operating envelope and retuning triggers.

## Decision points
Use PID for well-behaved SISO loops; use state-space, model-based, or nonlinear methods when coupling, constraints, or operating-range variation materially limit PID performance.

## Common failure patterns
Tuning around bad sensors, ignoring delay, integral windup, derivative noise, hidden saturation, gains copied across different payloads, and testing only at one operating point.

## Verification
Demonstrate stability margin or robust empirical behavior across expected loads, speeds, disturbances, and latency. Verify actuator headroom.

## Expected output
Controller configuration, measured response metrics, operating limits, and tuning rationale.

## Stop conditions
Stop if instability threatens hardware, actuator saturation is persistent, or sensor/latency defects dominate controller behavior.