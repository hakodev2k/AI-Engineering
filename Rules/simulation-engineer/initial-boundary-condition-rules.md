# Initial and Boundary Condition Rules
## Purpose
Ensure experiments start from controlled, physically or operationally defensible states.
## Scope
Initial states, boundary conditions, forcing functions, warm-up, and termination conditions.
## MUST
- Specify all material initial and boundary conditions explicitly.
- Validate conditions against model assumptions and intended scenarios.
- Separate initialization transients from steady-state measurements when relevant.
## MUST NOT
- Use convenient defaults whose effect on outputs is unknown.
- Compare scenarios initialized inconsistently unless the difference is intentional.
## SHOULD
- Test sensitivity to uncertain initial conditions.
## Exceptions
Randomized initialization requires a documented distribution and seed policy.
## Verification
Inspect scenario definitions, initialization logs, transient analysis, and sensitivity tests.