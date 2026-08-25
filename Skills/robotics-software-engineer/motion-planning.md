# Motion Planning

## Purpose
Plan collision-aware, constraint-respecting robot motions that are feasible for the robot and predictable under production conditions.

## When to use
Use for manipulator trajectory generation, mobile/whole-body planning, obstacle avoidance, constrained motion, or planning-failure investigation.

## Inputs
- Robot kinematic model
- Collision geometry
- Start and goal states
- Joint/task constraints
- Environment representation
- Timing and smoothness requirements

## Preconditions
Kinematics, joint limits, frames, and collision geometry must be validated.

## Context to inspect
Inspect planning scene updates, planner parameters, collision margins, IK behavior, trajectory postprocessing, dynamic-obstacle handling, and controller interface.

## Core knowledge
Understand configuration space, sampling/search/optimization planners, constraints, collision checking, IK coupling, singularities, path smoothing, time parameterization, and replanning trade-offs.

## Procedure
1. Define success criteria beyond merely reaching the goal.
2. Validate start state, goal constraints, and collision model.
3. Choose planner family based on dimensionality, constraints, and latency requirements.
4. Set collision margins using physical uncertainty.
5. Bound planning time and number of retries.
6. Validate path feasibility before time parameterization.
7. Apply velocity, acceleration, and jerk limits.
8. Check the generated trajectory against the latest environment state.
9. Define cancellation and replanning behavior.
10. Record failure reason and planner diagnostics.
11. Test narrow passages, near limits, singular regions, blocked goals, and stale environment data.

## Decision points
Prefer search-based methods where structured discrete costs dominate; sampling methods for high-dimensional free-space planning; optimization methods for smooth constrained trajectories when initialization is adequate. Replan only when environment uncertainty and control architecture make it safe.

## Common failure patterns
- Treating planning success as execution safety
- Collision geometry not matching real hardware
- Infinite retries on impossible goals
- Ignoring controller dynamic limits
- Planning against stale obstacle data
- Excessively small margins that hide model uncertainty

## Verification
Replay representative scenes, check collisions and constraints, measure solve-time distributions, execute at reduced speed, and verify cancellation/replanning behavior.

## Expected output
A planner configuration and execution contract with constraints, timing limits, diagnostics, and validated difficult-case behavior.

## Stop conditions
Stop if geometry accuracy is insufficient for required margins, the goal is infeasible, planners exceed the real-time budget, or execution safety cannot be guaranteed from the available environment state.