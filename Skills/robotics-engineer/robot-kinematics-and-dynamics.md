# Robot Kinematics and Dynamics

## Purpose
Model robot motion and forces accurately enough for planning, control, simulation, and safety analysis.

## When to use
Use for manipulators, mobile robots, legged systems, or any platform where geometric or dynamic models affect commanded motion.

## Inputs
Joint topology, link geometry, actuator data, inertial parameters, limits, payloads, friction assumptions, coordinate frames.

## Preconditions
Mechanical structure and joint definitions are sufficiently known.

## Context to inspect
URDF or equivalent model, joint conventions, limits, gear ratios, calibration offsets, controller assumptions, simulation parameters.

## Core knowledge
Forward and inverse kinematics solve geometry; Jacobians relate joint and task-space velocities/forces; dynamics add inertia, Coriolis, gravity, friction, and actuator constraints. Model fidelity should match the control and planning problem.

## Procedure
1. Validate joint types, axes, origins, and limits.
2. Verify forward kinematics against measured poses.
3. Identify singularities and unreachable regions.
4. Select inverse-kinematics strategy and constraints.
5. Validate Jacobians numerically.
6. Add inertial and payload parameters where dynamics matter.
7. Compare predicted torque/acceleration with measured behavior.
8. Encode safety margins on joint, velocity, acceleration, and torque limits.
9. Test across representative configurations and payloads.
10. Record model uncertainty and operating envelope.

## Decision points
Use analytical IK when available and maintainable; use numerical optimization for complex constraints. Use full dynamics only when simpler models fail required performance.

## Common failure patterns
Wrong joint signs, poor inertial data, unmodeled payloads, singularity blindness, impossible IK targets, and trusting simulation without physical validation.

## Verification
Check pose error, Jacobian finite differences, torque predictions, limit enforcement, and representative trajectory tracking.

## Expected output
Validated kinematic/dynamic model, operating limits, singularity notes, and test evidence.

## Stop conditions
Stop when physical geometry or actuator parameters are contradictory, or model error invalidates downstream safety/performance assumptions.