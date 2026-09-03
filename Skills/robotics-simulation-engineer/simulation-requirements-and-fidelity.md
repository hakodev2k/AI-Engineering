# Simulation Requirements and Fidelity

## Purpose
Define the minimum simulation fidelity needed to answer an engineering question without wasting compute or creating false confidence. Senior simulation work starts from decisions and error budgets, not from maximizing realism.

## When to use
Use when creating or revising a robotics simulator, choosing physics/rendering fidelity, or deciding whether a scenario can be validated virtually. Do not use simulation as the sole acceptance gate for hazards that require physical evidence.

## Inputs
Robot architecture, control loop rates, sensors and actuators, target tasks, physical environment, acceptance criteria, known field failures, compute budget.

## Preconditions
The engineering question and downstream decision must be explicit.

## Context to inspect
Inspect real robot logs, hardware tolerances, controller assumptions, contact regimes, sensor characteristics, timing constraints, and existing simulator limitations.

## Core knowledge
Fidelity is multidimensional: geometry, dynamics, contact, sensing, timing, materials, actuation, environment, and stochasticity. The correct fidelity is the lowest level that preserves the phenomena governing the decision. Calibration and validation against physical evidence matter more than visual realism.

## Procedure
1. State the decision the simulation must support.
2. Identify physical and software phenomena that can change that decision.
3. Rank phenomena by sensitivity and uncertainty.
4. Define quantitative fidelity targets and tolerances.
5. Separate must-model effects from safe abstractions.
6. Choose simulator configuration and timestep accordingly.
7. Define real-world reference measurements.
8. Run sensitivity tests on uncertain parameters.
9. Document known non-modeled effects.
10. Establish conditions where simulation evidence is insufficient.

## Decision points
Use higher fidelity only when lower fidelity changes outcomes materially. Prefer simpler models for large scenario sweeps; reserve expensive models for contact-rich or safety-critical cases. Use co-simulation when one engine cannot represent all required phenomena reliably.

## Common failure patterns
Visual realism mistaken for physical accuracy; undocumented abstractions; arbitrary timestep; tuning simulation until one trajectory matches; ignoring hardware variability; validating with the same cases used for calibration.

## Verification
Compare selected observables against physical data with predefined tolerances. Verify sensitivity conclusions and repeatability. Implementation is complete when the model runs; verification requires evidence that the modeled phenomena predict relevant robot behavior.

## Expected output
A fidelity specification with required phenomena, tolerances, calibration evidence, assumptions, compute trade-offs, and simulation stop boundaries.

## Stop conditions
Escalate when required physical data is unavailable, safety claims depend on unvalidated phenomena, or parameter uncertainty overwhelms the required decision margin.