# Robot Model Import and Validation

## Purpose
Import URDF, SDF, MJCF, CAD-derived, or equivalent robot models into simulation while preserving kinematics, inertial properties, collision geometry, joint limits, and actuator semantics.

## When to use
Use when onboarding a robot, updating mechanical revisions, changing simulation engines, or investigating discrepancies between simulated and physical motion.

## Inputs
Robot description files, CAD/inertial data, joint specifications, actuator limits, reference poses, physical measurements, simulator conventions.

## Preconditions
Model version and hardware revision must be identifiable.

## Context to inspect
Coordinate conventions, link origins, mass and inertia tensors, collision versus visual meshes, mimic/coupled joints, transmissions, damping/friction, limits, and controller expectations.

## Core knowledge
A model can render correctly while being dynamically wrong. Inertia frames, units, mesh scaling, collision simplification, joint axes, center of mass, and sign conventions are frequent sources of systemic error.

## Procedure
1. Confirm units and coordinate conventions.
2. Validate the link/joint tree and expected degrees of freedom.
3. Check joint axes, limits, home positions, and coupling.
4. Compare masses, centers of mass, and inertia tensors to authoritative data.
5. Inspect collision meshes independently from visuals.
6. Validate actuator effort, velocity, damping, and friction assumptions.
7. Spawn canonical poses and check transforms.
8. Run gravity-only and free-motion sanity tests.
9. Compare representative joint trajectories with physical measurements.
10. Record deviations and model provenance.

## Decision points
Use simplified collision geometry when it preserves contact-relevant shape and materially improves performance. Prefer measured inertial properties over CAD estimates when trustworthy measurements exist.

## Common failure patterns
Wrong mesh scale; invalid inertia; hidden self-collisions; joint axis inversion; stale hardware revision; visual mesh used as expensive collision mesh; simulator-specific defaults left implicit.

## Verification
Check static pose, forward kinematics, joint limit behavior, total mass, center of mass, collision behavior, and selected dynamic trajectories against reference values.

## Expected output
A validated robot model plus documented assumptions, provenance, tolerances, and known discrepancies.

## Stop conditions
Stop if authoritative geometry/inertial data conflicts materially, model version cannot be established, or discrepancies imply a mechanical/configuration issue outside simulation.