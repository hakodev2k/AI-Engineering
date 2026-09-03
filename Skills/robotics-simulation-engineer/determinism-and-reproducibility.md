# Determinism and Reproducibility

## Purpose
Make simulation results reproducible enough to diagnose regressions, compare algorithms, and distinguish stochastic variation from software defects.

## When to use
Use for CI, benchmark suites, failure reproduction, policy comparison, and any simulation whose result must be auditable.

## Inputs
Simulator version, seeds, asset versions, scenario definitions, runtime/hardware configuration, middleware and model versions.

## Preconditions
Sources of randomness and concurrency must be discoverable.

## Context to inspect
Random generators, physics nondeterminism, thread scheduling, GPU kernels, asynchronous messaging, unordered collections, asset downloads, adaptive algorithms, and external services.

## Core knowledge
Bitwise determinism is not always feasible or necessary. Senior practice defines a reproducibility target appropriate to the decision: exact trajectory, equivalent event sequence, or statistically equivalent distribution. Seeds alone do not control concurrency or floating-point variation.

## Procedure
1. Define required reproducibility level.
2. Inventory random and nondeterministic sources.
3. Centralize and record seeds where possible.
4. Pin simulator, assets, dependencies, and model versions.
5. Remove hidden network/runtime variability from regression paths.
6. Capture scenario parameters and initial state.
7. Run repeated identical trials and quantify divergence.
8. Separate deterministic regression cases from stochastic evaluation suites.
9. Store enough metadata to replay failures.
10. Establish statistical comparison criteria when exact replay is impossible.

## Decision points
Require exact determinism for small unit/regression simulations where practical. Use distribution-level reproducibility for GPU-heavy, distributed, or stochastic systems when bitwise equivalence would impose disproportionate cost.

## Common failure patterns
Recording only a seed; unpinned assets; nondeterministic startup order; assuming identical average metrics imply reproducibility; discarding failed run metadata.

## Verification
Replay representative failures from recorded metadata and confirm results meet the declared reproducibility level across repeated runs and supported environments.

## Expected output
A reproducibility contract, captured run manifest, repeatability measurements, and known nondeterministic sources.

## Stop conditions
Escalate when uncontrolled external components materially affect results or reproducibility requirements conflict with production-realistic concurrency and no statistical alternative is acceptable.