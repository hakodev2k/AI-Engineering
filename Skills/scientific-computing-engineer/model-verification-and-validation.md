# Model Verification and Validation

## Purpose
Establish whether scientific software solves the equations correctly and whether the equations adequately represent the intended real-world phenomenon.

## When to use
Use before trusting simulation results, after major solver changes, when onboarding a new physical model, or when results disagree with experiments.

## Inputs
Governing equations, implementation, analytical solutions, benchmark cases, experimental data, tolerances, and uncertainty information.

## Context to inspect
Discretization, solver tolerances, boundary conditions, calibration, parameter sources, experiment quality, and known model assumptions.

## Core knowledge
Verification asks whether the implementation solves the stated mathematical model correctly. Validation asks whether that model is sufficiently accurate for the intended use. Passing one does not imply the other.

## Procedure
1. Define intended use and quantities of interest.
2. Identify code-verification cases with known or manufactured solutions.
3. Run convergence studies for discretization and solver tolerances.
4. Separate numerical error from parameter and measurement uncertainty.
5. Select independent experimental or benchmark validation data.
6. Define comparison metrics before inspecting outcomes.
7. Quantify discrepancy and uncertainty.
8. Investigate systematic deviations rather than retuning immediately.
9. Document domain of validity and excluded regimes.
10. Re-run validation after material model changes.

## Decision points
Use manufactured solutions to isolate implementation correctness when analytical solutions are scarce. Use experimental validation only when measurement uncertainty and boundary conditions are sufficiently characterized.

## Common failure patterns
Calibrating and validating on the same data, treating visual agreement as validation, ignoring numerical error, and extending conclusions beyond validated regimes.

## Verification
Confirm convergence on verification problems and statistically defensible agreement on independent validation cases within predefined criteria.

## Expected output
A verification/validation matrix, evidence, quantified discrepancies, and a documented domain of validity.

## Stop conditions
Stop when validation data quality is inadequate or intended-use acceptance criteria are undefined.