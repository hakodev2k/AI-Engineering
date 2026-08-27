# Numerical Methods Rules
## Purpose
Prevent numerical artifacts from being mistaken for system behavior.
## Scope
Solvers, discretization, integration, optimization, and numerical linear algebra.
## MUST
- Select algorithms consistent with stiffness, conditioning, conservation properties, and required accuracy.
- Define convergence criteria and test sensitivity to timestep, mesh, tolerance, or iteration limits.
- Detect and surface non-convergence, NaN, overflow, and invalid states.
## MUST NOT
- Silently accept solver failure or unstable trajectories.
- Tune tolerances solely to obtain a preferred result.
## SHOULD
- Use independent analytical or numerical checks for critical calculations.
## Exceptions
Approximate methods require bounded error evidence and documented impact.
## Verification
Run convergence studies, solver diagnostics, invariant checks, and regression tests.