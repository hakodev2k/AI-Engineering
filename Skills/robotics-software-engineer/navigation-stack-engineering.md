# Navigation Stack Engineering

## Purpose
Engineer reliable autonomous navigation across global planning, local planning, costmaps, localization, recovery, and command execution.

## When to use
Use when implementing or tuning autonomous mobile robot navigation, diagnosing oscillation/stalls, or adapting navigation to a new environment.

## Inputs
- Robot footprint and dynamics
- Localization source
- Map and obstacle sensors
- Mission behaviors
- Safety and speed limits
- Representative environments

## Preconditions
Localization, frames, actuator interfaces, and obstacle sensing must already meet minimum quality requirements.

## Context to inspect
Inspect costmaps, inflation, footprint, global/local planners, controller frequency, behavior trees/state machines, velocity limits, recovery behaviors, and localization confidence.

## Core knowledge
Understand global versus local planning, costmap semantics, inflation, dynamic obstacles, nonholonomic constraints, controller lookahead, progress checking, recovery, and goal tolerances.

## Procedure
1. Validate footprint and motion limits.
2. Confirm map and localization frame semantics.
3. Configure obstacle sources and freshness thresholds.
4. Establish conservative global and local planner baselines.
5. Tune inflation and clearance against physical uncertainty.
6. Measure controller tracking and stopping distance.
7. Configure progress and stuck detection.
8. Add bounded recovery behaviors with explicit exit conditions.
9. Test narrow spaces, dynamic crossings, dead ends, localization degradation, and blocked goals.
10. Capture metrics for success rate, intervention rate, path efficiency, and near-collision events.
11. Regression-test representative routes before deployment.

## Decision points
Prefer conservative clearance when model uncertainty dominates. Use specialized planners for nonholonomic or high-speed platforms. Recovery should restore a known condition, not blindly retry the same failed plan.

## Common failure patterns
- Wrong footprint dimensions
- Stale obstacle layers
- Recovery loops with no progress
- Goal tolerances tighter than localization accuracy
- Local planner tuned without stopping-distance evidence

## Verification
Run repeatable route suites, inspect costmaps, measure path tracking, stopping distance, goal completion, and recovery success under controlled faults.

## Expected output
A navigation configuration with measurable performance, bounded recovery, safety margins, and regression routes.

## Stop conditions
Stop if localization quality is below navigation requirements, obstacle sensing cannot support stopping distance, or recovery behavior could create unsafe motion.