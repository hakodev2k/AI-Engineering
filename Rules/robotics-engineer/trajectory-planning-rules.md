# Trajectory Planning Rules
## Purpose
Ensure planned motion respects physical, operational, and safety constraints.
## Scope
Path planning, trajectory generation, smoothing, collision constraints, and execution handoff.
## MUST
- Enforce joint, workspace, velocity, acceleration, jerk, actuator, and collision constraints relevant to the robot.
- Define planner timeout, infeasibility, and partial-solution behavior.
- Revalidate plans when environment, localization, payload, or robot state changes beyond defined tolerances.
- Ensure execution starts from a state compatible with the planned trajectory.
## MUST NOT
- Execute stale trajectories after material world-state changes.
- Treat planner success as proof of collision-free execution without validated geometry and state assumptions.
## SHOULD
- Preserve safety margin for modeling and sensing uncertainty.
## Exceptions
Constraint relaxation requires explicit rationale, bounded risk, evidence, and approval for safety-relevant limits.
## Verification
Use simulation, constraint assertions, collision regression suites, randomized scenarios, and hardware tests at bounded speed.