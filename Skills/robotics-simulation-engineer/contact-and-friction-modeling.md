# Contact and Friction Modeling

## Purpose
Model contact, friction, compliance, and surface interaction with enough accuracy to support manipulation, locomotion, grasping, docking, or collision analysis.

## When to use
Use for contact-rich tasks, persistent simulation-to-real mismatch at interfaces, unstable grasping, unrealistic sliding, or force-control validation.

## Inputs
Material pairs, geometry, normal/tangential force measurements, contact speeds, robot task, physics-engine capabilities.

## Preconditions
Collision geometry and inertial parameters must already be credible.

## Context to inspect
Static/dynamic friction, restitution, contact stiffness/damping, friction cones, rolling/torsional friction, compliance, contact patches, solver regularization, surface velocity.

## Core knowledge
A single Coulomb coefficient rarely captures real interfaces across load, velocity, contamination, and surface state. Contact parameters are often non-identifiable from trajectory data alone; use direct measurements when possible and preserve uncertainty.

## Procedure
1. Identify task-critical material pairs and contact modes.
2. Gather reference slip, force, impact, and settling measurements.
3. Verify collision geometry at the actual contact scale.
4. Configure a simple baseline model.
5. Fit parameters against isolated contact experiments, not full task success.
6. Test across loads, speeds, orientations, and repeated contacts.
7. Quantify sensitivity to uncertain parameters.
8. Introduce compliance or richer friction only when baseline error requires it.
9. Validate full-task behavior on held-out conditions.
10. Document valid operating ranges.

## Decision points
Use simple Coulomb friction for broad sweeps when detailed effects are insignificant. Use compliant or velocity-dependent models when force transients or stick-slip behavior materially affect decisions. Treat fitted coefficients as effective model parameters, not universal material constants.

## Common failure patterns
Tuning friction to make a demo succeed; ignoring mesh/contact resolution; fitting multiple correlated parameters from one trajectory; excessive restitution; unrealistic stiffness causing solver instability.

## Verification
Compare slip onset, force/torque profiles, impact response, contact duration, settling, and task outcomes against independent physical tests.

## Expected output
A calibrated contact model, uncertainty ranges, validation cases, and explicit limitations.

## Stop conditions
Stop when required contact behavior cannot be represented by the engine, measurements are insufficient to identify parameters, or safety conclusions depend on unvalidated contact forces.