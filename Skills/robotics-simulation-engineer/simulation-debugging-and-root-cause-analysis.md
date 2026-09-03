# Simulation Debugging and Root-Cause Analysis

## Purpose
Diagnose robotics simulation failures systematically and distinguish software defects, model errors, numerical artifacts, timing problems, invalid scenarios, and genuine robot-behavior regressions.

## When to use
Use when a simulation crashes, diverges, becomes unstable, produces impossible contacts, disagrees with hardware, flakes in CI, or reports a behavior regression.

## Inputs
Failure run metadata, logs, traces, scenario and seed, simulator/model versions, robot software revision, metrics, recordings, physical reference data when relevant.

## Preconditions
Preserve the failed run before changing parameters or rerunning destructively.

## Context to inspect
Initial state, model provenance, physics settings, contacts, transforms, timestamps, sensor/actuator values, controller state, middleware queues, resource saturation, random seeds, recent code/assets/configuration changes.

## Core knowledge
Simulation failures frequently have layered causes. A controller may appear unstable because of bad inertia; a perception regression may originate in renderer calibration; a CI flake may be timing or nondeterminism rather than robot logic. Change one explanatory variable at a time and demand evidence.

## Procedure
1. Capture the exact failing run identity and artifacts.
2. Reproduce with the same scenario, seed, versions, and resources.
3. Classify the first observable divergence, not the final symptom.
4. Compare against the last known-good run at aligned simulation time.
5. Bisect code, model, asset, and configuration changes where feasible.
6. Inspect invariants: finite state, valid transforms, legal limits, positive mass/inertia, monotonic time, and contact sanity.
7. Reduce the scenario to the smallest reproduction while preserving failure.
8. Vary timestep, solver, seed, and compute load only as controlled diagnostic experiments.
9. Compare with physical evidence if the issue is a sim-to-real mismatch.
10. Fix the root cause, then restore the full scenario and run adjacent regressions.
11. Add instrumentation or a regression test that would detect recurrence.

## Decision points
Treat failures sensitive to timestep/solver settings as possible numerical/model issues before changing control logic. Treat failures sensitive to machine load as timing/concurrency suspects. Modify simulation parameters only when evidence says the model is wrong, not merely to make a test pass.

## Common failure patterns
Tuning away symptoms; changing multiple variables; debugging only final crash state; losing the original seed/configuration; assuming simulator correctness; ignoring NaNs or transform discontinuities; accepting flaky reruns as resolution.

## Verification
Reproduce the original failure before the fix, demonstrate it no longer occurs after the fix, validate the proposed causal mechanism, and run nearby scenarios plus relevant hardware comparisons. A patch is implemented when behavior changes; it is verified when evidence supports the root cause and no unacceptable regression is introduced.

## Expected output
A root-cause record containing reproduction, first divergence, evidence, causal explanation, corrective change, verification results, and regression protection.

## Stop conditions
Escalate when the failure cannot be reproduced with preserved artifacts, simulator internals require unsupported modification, evidence implicates unsafe physical behavior, or conclusions require hardware tests beyond authorized access.