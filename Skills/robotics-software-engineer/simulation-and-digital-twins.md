# Simulation and Digital Twins

## Purpose
Build simulation environments that accelerate development and regression testing without creating false confidence about physical-robot behavior.

## When to use
Use for algorithm development, CI testing, synthetic scenarios, hardware-unavailable development, failure injection, or pre-deployment validation.

## Inputs
- Robot model and dynamics
- Sensor/actuator interfaces
- Environment assets
- Real-world reference data
- Test objectives
- Simulator constraints

## Preconditions
The team must distinguish which behaviors the simulator models accurately and which require hardware validation.

## Context to inspect
Inspect URDF/SDF or equivalent, mass/inertia, joints, friction, sensor noise, actuator dynamics, collision geometry, simulated time, bridges, and scenario definitions.

## Core knowledge
Understand model fidelity, numerical integration, sensor noise, contact modeling, domain gap, deterministic replay, simulated time, hardware-in-the-loop, and scenario coverage.

## Procedure
1. Define simulation objectives and required fidelity per subsystem.
2. Validate robot dimensions, limits, and frames.
3. Calibrate dynamics only to the precision needed by the target tests.
4. Model sensor latency/noise/dropout where relevant.
5. Keep simulated interfaces compatible with production interfaces.
6. Create deterministic scenarios for regression tests.
7. Add randomized scenarios for robustness exploration.
8. Compare simulation outputs with recorded physical behavior.
9. Label tests that still require software-in-loop, hardware-in-loop, or real-robot validation.
10. Version models and scenario assets with software changes.

## Decision points
Use low-fidelity simulation for fast logic tests and higher fidelity only when physical dynamics affect conclusions. Prefer HIL when timing or hardware protocol behavior dominates risk.

## Common failure patterns
- Perfect sensors masking estimator weaknesses
- Unrealistic friction/contact
- Simulation-only timing assumptions
- Test pass treated as real-world proof
- Divergent production and simulation interfaces

## Verification
Compare key trajectories, sensor distributions, latency, collision behavior, and controller response against physical recordings. Confirm scenario reproducibility in CI.

## Expected output
A versioned simulation environment with documented fidelity limits, repeatable scenarios, and a clear validation ladder to physical hardware.

## Stop conditions
Stop if required physical effects cannot be represented credibly, simulator behavior contradicts measured hardware behavior, or safety decisions would rely solely on unvalidated simulation.