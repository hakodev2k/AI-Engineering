# Simulation and Digital Twin Validation

## Purpose
Use simulation to accelerate robotics development while explicitly validating model fidelity and preventing false confidence from unrealistic virtual behavior.

## When to use
Use for algorithm development, regression testing, planner/controller evaluation, fault injection, hardware-unavailable work, or deployment rehearsal.

## Inputs
Robot model, environment model, sensor/actuator models, timing assumptions, real-world datasets, target scenarios, acceptance metrics.

## Preconditions
The simulation scope and decisions it will support are defined.

## Context to inspect
Physics engine, collision geometry, contact parameters, actuator dynamics, sensor noise/latency, update rates, clocks, world assets, randomization.

## Core knowledge
Simulation validity is question-specific. Geometric planning may need accurate collision geometry while force control needs credible contact and actuator dynamics. Matching average behavior is insufficient if tail failures matter.

## Procedure
1. Define what claims simulation must support.
2. Identify parameters most influential to those claims.
3. Build the minimum model fidelity required.
4. Add sensor noise, latency, dropout, and actuator limits where relevant.
5. Validate coordinate frames and timing.
6. Compare simulated traces against physical-system traces.
7. Calibrate high-impact parameters from measurements.
8. Create nominal, edge, and fault scenarios.
9. Use randomized parameters to expose brittle assumptions when appropriate.
10. Label conclusions as simulation-only until physical validation closes the gap.

## Decision points
Increase fidelity only when it changes decisions or failure coverage. Prefer recorded-data replay when physical dynamics are secondary but perception/estimation reproducibility matters.

## Common failure patterns
Perfect sensors, zero latency, unrealistically rigid contacts, incorrect inertias, no actuator saturation, simulation-specific hacks, and claiming physical safety from virtual tests alone.

## Verification
Quantify model-to-reality error on relevant outputs and confirm representative failures reproduce similarly enough for the intended decision.

## Expected output
Validated simulation model, fidelity assumptions, comparison evidence, scenario suite, and known sim-to-real gaps.

## Stop conditions
Stop relying on simulation when model error exceeds the tolerance for the decision or safety requires physical evidence.