# Kinematics and Dynamics Rules
## Purpose
Keep robot models physically consistent and safe to use for control and planning.
## Scope
Forward/inverse kinematics, Jacobians, dynamics, payload models, and constraints.
## MUST
- Document model assumptions, joint conventions, limits, singularities, and parameter sources.
- Handle unreachable poses and singular or ill-conditioned configurations explicitly.
- Validate model outputs against measured robot behavior across representative configurations.
- Update mass, inertia, center-of-mass, and payload parameters when materially changed.
## MUST NOT
- Command solutions outside mechanical or configured joint limits.
- Hide solver failure by returning arbitrary poses or stale solutions.
## SHOULD
- Prefer numerically robust solvers with bounded iteration and observable failure states.
## Exceptions
Simplified models require quantified error bounds appropriate to the decision they support.
## Verification
Run known-pose tests, numerical consistency checks, singularity tests, payload validation, and hardware correlation measurements.