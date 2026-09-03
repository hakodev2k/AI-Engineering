# Actuator and Drive Modeling

## Purpose
Represent motors, drives, transmissions, brakes, and actuator limits so simulated control behavior reflects real torque, velocity, delay, saturation, and thermal constraints.

## When to use
Use when controller performance differs between simulation and hardware, when sizing actuators, or when validating aggressive motion and load cases.

## Inputs
Motor/drive specs, transmission ratios, torque-speed curves, current limits, controller logs, thermal limits, measured step responses.

## Preconditions
Mechanical model, units, and joint sign conventions must be validated.

## Context to inspect
Command interface, control mode, torque constants, gearbox efficiency/backlash, saturation, deadband, rate limits, current loop bandwidth, delay, brake behavior, and thermal derating.

## Core knowledge
Ideal torque sources overestimate performance and stability margins. Actuator behavior is state-dependent and includes bandwidth, saturation, friction, compliance, drive protections, and power limits. Effective models should reproduce task-relevant closed-loop behavior without duplicating unnecessary electronics detail.

## Procedure
1. Map software commands to physical drive behavior.
2. Record static and dynamic actuator limits.
3. Build the simplest actuator transfer model consistent with evidence.
4. Add saturation, slew/rate limits, and command delay.
5. Include transmission efficiency, backlash, or compliance when measurable effects matter.
6. Compare isolated step, ramp, and load responses to hardware.
7. Add thermal or power derating for sustained workloads when relevant.
8. Validate under representative closed-loop trajectories.
9. Sweep parameter uncertainty and identify controller sensitivity.
10. Version models by hardware/firmware revision.

## Decision points
Prefer lookup curves over high-order models when they reproduce operational limits adequately. Add electrical/thermal dynamics only when the task duration or performance envelope makes them decision-critical.

## Common failure patterns
Ideal unlimited torque; confusing joint-side and motor-side quantities; ignoring gearbox losses; hardcoded latency; fitting only no-load motion; missing drive protection behavior.

## Verification
Compare torque/velocity envelopes, command-to-motion delay, saturation events, load responses, and closed-loop tracking against held-out hardware traces.

## Expected output
A calibrated actuator model with parameters, limits, uncertainty ranges, validation evidence, and revision provenance.

## Stop conditions
Stop when required proprietary drive behavior is unavailable, measurements contradict specifications materially, or unsafe hardware experiments would be required for calibration.