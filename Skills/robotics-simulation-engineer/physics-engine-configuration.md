# Physics Engine Configuration

## Purpose
Configure a robotics physics engine so integration, constraints, contacts, and solver behavior match the engineering problem rather than relying on opaque defaults.

## When to use
Use when establishing a simulator, changing engines, debugging instability, or tuning contact-heavy tasks.

## Inputs
Robot model, expected contact regimes, control frequency, material assumptions, compute budget, physical reference data.

## Preconditions
The target behaviors and acceptable numerical error must be known.

## Context to inspect
Integrator, solver iterations, constraint stabilization, substeps, contact offsets, restitution, friction model, sleeping, collision filtering, precision, and deterministic settings.

## Core knowledge
Physics engines approximate rigid-body dynamics differently. Solver parameters interact: reducing timestep can improve stability but increase cost; high iterations can hide bad model parameters; contact regularization can improve numerical behavior while distorting physical response.

## Procedure
1. Identify dominant dynamics and contact regimes.
2. Establish control and simulation timestep relationship.
3. Select integrator and solver appropriate to stiffness and contact.
4. Set conservative baseline solver tolerances and iterations.
5. Configure friction, restitution, damping, and contact margins from evidence.
6. Disable irrelevant features that add nondeterminism or cost.
7. Run canonical free-fall, pendulum, sliding, stacking, and robot-specific tests.
8. Sweep timestep and solver settings for convergence.
9. Compare observables with physical references.
10. Freeze and version the validated configuration.

## Decision points
Prefer smaller timesteps for stiff contact and fast control only when convergence evidence requires them. Increase solver iterations after checking geometry and inertial validity. Select engine-specific features only when portability is not a requirement.

## Common failure patterns
Blindly copying defaults; compensating for invalid inertia with solver tuning; changing several parameters simultaneously; using visually plausible behavior as validation; undocumented engine-version changes.

## Verification
Demonstrate numerical convergence across selected timestep/iteration perturbations and compare relevant forces, trajectories, settling behavior, and contact outcomes to reference data.

## Expected output
A versioned physics configuration with rationale, benchmark cases, validated ranges, and known limitations.

## Stop conditions
Escalate when no stable configuration reproduces required behavior, the physical model is under-specified, or solver artifacts dominate the target phenomenon.