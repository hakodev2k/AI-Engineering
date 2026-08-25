# Kinematics and Dynamics

## Purpose
Model robot motion and forces accurately enough for planning, control, simulation, and diagnostics.

## When to use
Use when implementing manipulators, mobile bases, legged systems, inverse kinematics, feedforward control, or diagnosing geometry-dependent motion errors.

## Inputs
- Robot geometry and joint definitions
- Mass and inertia properties
- Joint limits
- End-effector/tool frames
- Required accuracy and control rates

## Preconditions
Robot dimensions, joint conventions, and frame definitions must be trustworthy.

## Context to inspect
Inspect URDF/SDF or equivalent models, joint ordering, transforms, calibration offsets, inertia tensors, gear ratios, limits, and solver assumptions.

## Core knowledge
Understand forward/inverse kinematics, Jacobians, singularities, velocity kinematics, rigid-body dynamics, inertia, gravity, Coriolis effects, underactuation, constraints, and numerical conditioning.

## Procedure
1. Validate coordinate frames and joint directions against the physical robot.
2. Confirm link dimensions and joint limits.
3. Implement or select forward-kinematics computation.
4. Compare computed poses against measured reference poses.
5. Select inverse-kinematics strategy based on redundancy, constraints, and convergence needs.
6. Detect singular and near-singular configurations.
7. Validate Jacobians numerically.
8. Add dynamic terms only to the fidelity required by control objectives.
9. Compare simulated and measured motion/torque behavior.
10. Document solver tolerances and failure semantics.

## Decision points
Use analytic IK where available and maintainable; use numerical IK for generality and constrained redundancy. Prefer simpler dynamic models when they meet control objectives; added model complexity can amplify parameter error.

## Common failure patterns
- Incorrect frame or joint order
- Ignoring singularities
- Unvalidated inertia values
- IK returning mathematically valid but unsafe configurations
- Solver convergence treated as guaranteed
- Mixing degrees and radians

## Verification
Verify FK/IK round trips, numerical Jacobians, known poses, joint-limit enforcement, singularity handling, and comparison against physical measurements.

## Expected output
A validated motion model with explicit assumptions, solver behavior, constraints, and numerical tolerances.

## Stop conditions
Stop if physical geometry is uncertain, frame conventions conflict, required accuracy exceeds calibration evidence, or dynamic identification requires unavailable instrumentation.