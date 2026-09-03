# Continuous Control

## Purpose
Engineer RL policies for bounded continuous actions such as forces, rates, prices, resource allocations, or actuator commands while maintaining numerical stability and physical validity.

## When to use
Use when discretizing actions would materially reduce control quality or create an impractically large action space.

## Inputs
- Continuous action bounds and units
- Environment dynamics
- Control frequency and latency
- Reward and safety constraints

## Preconditions
Actuator/action limits and invalid regions must be explicit. A safe baseline controller should exist for high-risk systems.

## Context to inspect
Inspect action scaling, saturation, control smoothness, latency, noise, derivative limits, actuator dynamics, and whether simulator units match production.

## Core knowledge
Continuous-control agents are sensitive to action parameterization, squashing functions, exploration noise, critic extrapolation, and control frequency. Physically valid action transforms and rate constraints often matter more than network size.

## Procedure
1. Normalize action ranges with explicit inverse transforms.
2. Encode hard bounds and rate limits at the environment boundary.
3. Establish classical or heuristic controller baselines.
4. Select a continuous-control algorithm based on sample efficiency and stability needs.
5. Tune exploration noise relative to physical/action scale.
6. Track saturation, jerk/rate changes, constraint violations, and return.
7. Test sensor noise, latency, and actuator delay.
8. Evaluate across initial-condition and disturbance distributions.
9. Compare policy smoothness and safety against baselines.
10. Validate deployment behavior under real control-loop timing.

## Decision points
Prefer classical control when dynamics are sufficiently known and optimality requirements are modest. Use RL for nonlinear, uncertain, or high-dimensional objectives only when measured gains justify complexity.

## Common failure patterns
- Normalized actions are mapped to physical units incorrectly.
- Policy learns to exploit simulator actuator response.
- High reward comes from unsafe saturation.
- Training control frequency differs from deployment.

## Verification
Verify unit conversions, bounds, rate constraints, timing, disturbance robustness, and reproducible improvement over a safe controller baseline.

## Expected output
A continuous-control policy with validated action semantics, constraint enforcement, robustness metrics, and deployment timing evidence.

## Stop conditions
Stop if action safety cannot be guaranteed, simulator control dynamics are materially wrong, or real-time latency exceeds the control budget.