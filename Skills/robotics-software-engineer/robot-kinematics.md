# Robot Kinematics

## Purpose
Model and reason about rigid-body motion, coordinate frames, forward kinematics, inverse kinematics, and Jacobians so robot software can convert task-space intent into physically meaningful joint-space commands.

## When to use
Use when implementing manipulators, mobile manipulators, calibration logic, frame transforms, Cartesian control, motion planning, or diagnosing pose errors. Do not use an ad-hoc transform chain when a maintained frame model already exists.

## Inputs
Robot geometry, joint definitions and limits, frame conventions, end-effector definition, target poses, calibration data, and existing model files.

## Preconditions
Confirm units, handedness, angle conventions, frame ownership, and joint ordering before deriving or changing equations.

## Context to inspect
URDF/SDF or equivalent model, transform tree, encoder conventions, tool-center-point definitions, joint limits, controller interfaces, and any calibration offsets.

## Core knowledge
Senior robotics work requires disciplined frame semantics. Forward kinematics maps configuration to pose; inverse kinematics may be non-unique or infeasible; Jacobians map velocity and force relationships and expose singular behavior. Numerical solvers require constraints, seeds, tolerances, and joint-limit handling.

## Procedure
1. Define the source and target frames explicitly.
2. Validate robot topology and joint ordering against the runtime model.
3. Reproduce forward kinematics for known configurations.
4. Identify workspace limits, joint limits, and singular regions.
5. Choose analytical IK only when the mechanism and maintenance burden justify it; otherwise use constrained numerical IK.
6. Provide deterministic seeds and convergence tolerances.
7. Reject or classify infeasible targets rather than silently clipping them.
8. Use Jacobian conditioning to detect proximity to singularities.
9. Preserve frame timestamps when integrating live transforms.
10. Add representative boundary and regression cases.

## Decision points
Choose analytical vs numerical IK based on mechanism complexity, latency, solution multiplicity, and maintainability. Prefer damped least squares near singularities when exact inversion is unstable.

## Common failure patterns
Mixed degrees/radians, incorrect transform multiplication order, stale frames, ignored tool offsets, unreachable targets treated as solver failures, hidden joint-limit violations, and unstable Jacobian inversion.

## Verification
Compare computed transforms against trusted samples, visualize frame relationships, test reachable/unreachable targets, sweep joint limits, and measure solver residuals and timing.

## Expected output
A validated kinematic model or implementation with explicit conventions, solver behavior, edge-case handling, and tests.

## Stop conditions
Stop when mechanical geometry or calibration is unknown, safety-critical frame semantics cannot be confirmed, or the requested target violates documented hardware limits.