# GPU Testing and Validation Strategy

## Purpose
Design tests that cover GPU numerical correctness, concurrency, architecture diversity, failures, and performance-sensitive behavior.

## When to use
Use when adding kernels, upgrading GPU stacks, supporting new hardware, or establishing release criteria.

## Inputs
Operation semantics, supported GPUs, precision policy, failure history, performance targets, reference implementation, CI capacity.

## Preconditions
Define correctness tolerances and supported environment matrix.

## Context to inspect
Inspect boundary shapes, zero/tail cases, strides/layouts, concurrency, streams, precision modes, determinism, OOM behavior, architecture-specific paths, compiler/library versions, and fallbacks.

## Core knowledge
GPU correctness can depend on scheduling, precision, architecture, and shape. Exact equality is often inappropriate for floating-point work; tolerances should reflect numerical analysis and domain impact. Performance tests require controlled environments distinct from ordinary functional CI.

## Procedure
1. Define semantic invariants and numerical tolerances.
2. Maintain a trusted reference path.
3. Cover minimum, boundary, irregular, and large shapes.
4. Randomize data and launch conditions where useful.
5. Test concurrent streams and repeated execution.
6. Run memory/race tooling in dedicated jobs.
7. Test OOM/resource-exhaustion behavior.
8. Cover each architecture-specific dispatch path.
9. Add performance regression tests on stable hardware.
10. Validate upgrades against the full support matrix.
11. Preserve reproducer inputs for escaped defects.

## Decision points
Use property/reference tests for broad input coverage and golden outputs only where stable. Keep expensive sanitizers/nightly tests separate from fast presubmit tests while ensuring they gate releases appropriately.

## Common failure patterns
Only testing aligned shapes, overly loose tolerances, no concurrency stress, no old/new GPU coverage, performance tests on noisy hosts, ignoring fallbacks, and tests that synchronize so heavily they hide races.

## Verification
Verify test failures on seeded defects, coverage of dispatch paths and edge cases, sanitizer cleanliness, stable performance baselines, and traceability from incidents to regression tests.

## Expected output
A layered GPU test matrix with correctness, stress, sanitizer, compatibility, and performance coverage.

## Stop conditions
Stop when numerical acceptance criteria are undefined, required GPU classes are unavailable for release validation, or test infrastructure cannot isolate destructive/fault-injection cases.