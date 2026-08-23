# Motion Planning and Collision Avoidance

## Purpose
Generate feasible, safe robot motions through constrained spaces while respecting geometry, kinematics, dynamics, uncertainty, and execution limits.

## When to use
Use for manipulator path planning, mobile navigation, whole-body planning, obstacle avoidance, or when planned paths fail during execution.

## Inputs
Robot model, collision geometry, start/goal states, environment model, dynamic obstacles, joint/velocity/acceleration limits, safety margins.

## Preconditions
Transforms, robot geometry, and state estimation are trustworthy enough for planning.

## Context to inspect
Planner configuration, cost functions, collision checker, map update rates, replanning triggers, smoothing, controller interface, failure fallbacks.

## Core knowledge
Sampling, search, trajectory optimization, and reactive avoidance trade completeness, optimality, compute cost, and responsiveness. A collision-free geometric path may still be dynamically infeasible.

## Procedure
1. Define state/configuration space and constraints.
2. Validate collision geometry and inflation margins.
3. Define start/goal tolerances and infeasible-state handling.
4. Select planner family based on dimensionality and environment dynamics.
5. Add velocity, acceleration, curvature, or torque constraints as needed.
6. Define planning timeout and fallback behavior.
7. Smooth/time-parameterize without violating clearance or limits.
8. Validate against dynamic-obstacle update latency.
9. Test narrow passages, blocked goals, moving obstacles, and stale maps.
10. Record planning success rate, latency, clearance, and execution tracking.

## Decision points
Use global search for structured spaces, sampling for high-dimensional configuration spaces, optimization for smooth constrained trajectories, and local reactive methods for fast disturbance handling.

## Common failure patterns
Stale obstacle maps, under-modeled robot geometry, paths that graze uncertainty margins, unbounded replanning, goal states inside collisions, and planners disconnected from controller limits.

## Verification
Replay representative scenarios and measure success rate, worst-case latency, minimum clearance, dynamic feasibility, and execution tracking error.

## Expected output
Planner configuration, collision model, fallback policy, benchmark evidence, and documented infeasible cases.

## Stop conditions
Stop when environment data is too stale, collision geometry is untrusted, or safe margins cannot be maintained.