# Trajectory Generation and Time Parameterization

## Purpose
Convert geometric paths or task goals into smooth, dynamically feasible trajectories that controllers can execute safely.

## When to use
Use when motion is jerky, violates limits, misses timing constraints, or when planners produce geometry without executable timing.

## Inputs
Path waypoints, joint/task limits, velocity/acceleration/jerk bounds, actuator capability, controller period, synchronization requirements.

## Preconditions
Kinematic model and motion limits are validated.

## Context to inspect
Interpolation method, time scaling, command interface, controller bandwidth, sampling period, discontinuities, actuator saturation.

## Core knowledge
Trajectory feasibility depends on derivative continuity, actuator limits, controller bandwidth, and path curvature. Faster timing increases tracking error and saturation risk.

## Procedure
1. Validate waypoint/frame semantics.
2. Remove duplicate or discontinuous waypoints.
3. Choose interpolation appropriate to continuity requirements.
4. Apply velocity, acceleration, jerk, curvature, and torque constraints.
5. Time-parameterize the path with explicit margins.
6. Resample at a rate suitable for the controller.
7. Check start/stop boundary conditions.
8. Verify synchronized axes or subsystems where required.
9. Simulate tracking and actuator demand.
10. Test physical execution progressively from conservative speeds.

## Decision points
Prefer low-order interpolation for predictable behavior; use splines or optimization when smoothness and multi-constraint coordination justify complexity.

## Common failure patterns
Derivative discontinuities, hidden unit mismatches, excessive acceleration near short segments, interpolation overshoot, command rates lower than controller needs, and timing that assumes infinite actuator authority.

## Verification
Check all derivatives against limits, simulate tracking, inspect saturation, and measure physical path/timing error under representative payloads.

## Expected output
Executable trajectory, limit-check evidence, timing assumptions, and safe operating margins.

## Stop conditions
Stop when required timing cannot be met within actuator or safety limits.