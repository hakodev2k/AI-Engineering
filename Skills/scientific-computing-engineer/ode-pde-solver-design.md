# ODE and PDE Solver Design

## Purpose
Design and validate numerical solution strategies for ordinary and partial differential equations with explicit control over stability, accuracy, and computational cost.

## When to use
Use for time integration, spatial discretization, multiphysics simulation, stiff systems, or solver redesign after instability or poor convergence.

## Inputs
Governing equations, initial/boundary conditions, physical scales, stiffness characteristics, geometry/mesh information, accuracy goals, and runtime budget.

## Context to inspect
Discretization, timestep rules, mesh quality, source terms, constraints, conservation laws, solver tolerances, and validation cases.

## Core knowledge
Method suitability depends on stiffness, conservation requirements, smoothness, dimensionality, and stability limits. Consistency alone is insufficient; convergence and stability must be demonstrated.

## Procedure
1. Classify the equations and dominant scales.
2. Identify conservation, monotonicity, or positivity requirements.
3. Choose spatial and temporal discretizations.
4. Determine explicit versus implicit treatment.
5. Define stability and timestep constraints.
6. Configure nonlinear and linear inner solvers as needed.
7. Establish mesh/time refinement studies.
8. Validate against analytical, manufactured, or benchmark solutions.
9. Measure conservation and long-time drift.
10. Document solver limitations and failure modes.

## Decision points
Use implicit schemes when stiffness makes explicit timesteps impractical; prefer conservative discretizations when conserved quantities are scientifically material.

## Common failure patterns
Tuning until plots look plausible, ignoring mesh dependence, inconsistent boundary conditions, hidden solver non-convergence, and using large timesteps that suppress dynamics.

## Verification
Perform refinement studies, benchmark comparisons, conservation checks, and sensitivity analysis for tolerances and timestep controls.

## Expected output
A solver design with numerical rationale, convergence evidence, stability constraints, and validation results.

## Stop conditions
Stop when equations, boundary conditions, or acceptable error are not sufficiently specified.