# Dynamics and Control

## Purpose
Design, integrate, and review robot control software that respects system dynamics, actuator limits, stability requirements, and real-time constraints.

## When to use
Use for joint or Cartesian control, trajectory tracking, force/torque control, balancing, compliant interaction, controller tuning, or investigating oscillation and poor tracking.

## Inputs
Robot mass/inertia model, actuator limits, control rate, sensor signals, target trajectories, existing controller implementation, logs, and acceptance thresholds.

## Preconditions
Confirm the controlled plant, sample period, signal units, saturation limits, and whether the hardware controller closes lower-level loops internally.

## Context to inspect
Control architecture, update loop, filters, delays, actuator interfaces, feedforward terms, gain scheduling, anti-windup logic, safety interlocks, and observed frequency content.

## Core knowledge
Feedback performance depends on plant dynamics, sampling, delay, noise, saturation, and model mismatch. PID is not automatically sufficient. Feedforward can reduce tracking error, impedance/admittance changes interaction behavior, and model-based control trades robustness for model dependence.

## Procedure
1. Define the controlled variable and measurable performance criteria.
2. Map the complete loop, including hidden actuator or firmware loops.
3. Measure actual loop rate, jitter, delay, and sensor noise.
4. Establish actuator and state constraints.
5. Start with the simplest controller that meets the requirement.
6. Add feedforward or model compensation only with measurable benefit.
7. Implement saturation, rate limits, and anti-windup where relevant.
8. Tune in simulation or a constrained safe environment before full-energy testing.
9. Test step, ramp, disturbance, and trajectory responses.
10. Inspect overshoot, settling time, steady-state error, phase-like delay symptoms, and actuator effort.
11. Test degraded sensing and communication delay.
12. Record the final operating envelope and assumptions.

## Decision points
Use position/velocity control for precise free-space motion, torque or impedance approaches for compliant interaction, and MPC only when constraints and predictive benefit justify computational cost.

## Common failure patterns
Tuning around unmeasured delay, derivative noise amplification, integrator windup, commands beyond actuator authority, unstable gain changes across payloads, and testing directly on unrestricted hardware.

## Verification
Use repeatable logged experiments, compare target vs measured state, inspect saturation and stability margins empirically, test worst-case payloads, and verify safety stops remain effective.

## Expected output
A bounded, measurable controller configuration or implementation with tuning evidence and documented operating limits.

## Stop conditions
Stop if actuator limits, control topology, or safe test conditions are unknown, or if instability threatens people or hardware.