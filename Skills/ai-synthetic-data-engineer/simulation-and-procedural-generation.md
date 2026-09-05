# Simulation and Procedural Generation

## Purpose
Build controllable synthetic-data generators from explicit domain rules, simulators, physics engines, or procedural systems when exact scenario control and ground-truth state matter.

## When to use
Use for robotics, autonomous systems, industrial inspection, games, network/system testing, time-series processes, or any domain where relevant mechanisms can be modeled explicitly.

## Inputs
Domain rules, state variables, simulator configuration, parameter ranges, scenario taxonomy, sensor models, labels, target production conditions.

## Preconditions
The simulation assumptions and their known deviations from reality are documented.

## Context to inspect
Physical/business constraints, stochastic processes, boundary conditions, sensor noise, environment parameters, temporal dynamics, calibration data, production failure cases.

## Core knowledge
Simulation provides controllability and exact labels but introduces a sim-to-real gap. A senior engineer separates structural realism from cosmetic realism and validates which simulator dimensions actually affect downstream decisions.

## Procedure
1. Define the states, transitions, events, and outputs required by the downstream task.
2. Encode hard domain constraints explicitly.
3. Parameterize environmental and scenario variables.
4. Add realistic noise, missingness, latency, and sensor/system imperfections where relevant.
5. Use stratified or adaptive sampling rather than naive random generation.
6. Generate deterministic seeds for reproducibility.
7. Emit ground-truth labels directly from simulator state where possible.
8. Calibrate simulated distributions against real observations.
9. Identify sim-to-real discrepancies through downstream error analysis.
10. Refine only simulator factors that materially affect utility.

## Decision points
Use procedural simulation when rules are known and exact control matters. Add learned generative components when appearance or high-dimensional residual behavior is difficult to hand-model.

## Common failure patterns
Overinvesting in visual realism that does not affect the task, omitting realistic noise, creating physically impossible combinations, and tuning the simulator against the final evaluation set.

## Verification
Validate invariants, statistical calibration, scenario coverage, deterministic replay, and downstream transfer to real-world validation data.

## Expected output
A parameterized simulator or procedural generator with documented assumptions, reproducible scenarios, and sim-to-real validation evidence.

## Stop conditions
Stop when critical real-world mechanisms cannot be represented sufficiently or the simulation gap invalidates downstream conclusions.