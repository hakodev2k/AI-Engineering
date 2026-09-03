# Compiler Testing and Model Regression Suite

## Purpose
Design a layered test strategy that proves compiler transformations, generated kernels, and end-to-end LLM execution remain correct across models, shapes, dtypes, devices, and compiler revisions.

## When to use
Use when introducing a compiler subsystem, adding optimizations, expanding backend coverage, preventing recurring regressions, or reviewing test gaps before release.

## Inputs
- Compiler pass inventory
- Supported model families
- Target backends and dtypes
- Shape ranges
- Known failure history
- Reference execution paths

## Preconditions
Define supported configurations and numerical tolerances. Separate unsupported behavior from untested behavior.

## Context to inspect
Inspect unit tests, IR verifier tests, transformation golden tests, kernel tests, differential tests, end-to-end model tests, performance benchmarks, fuzzing, CI matrix, and flaky tests.

## Core knowledge
Compiler testing needs multiple layers. Small pass tests localize failures; differential execution validates semantics; model tests expose interactions; fuzzing discovers unusual combinations; performance tests prevent silent regressions. Golden IR tests are useful but brittle when they assert irrelevant textual details.

## Procedure
1. Inventory compiler stages and their critical invariants.
2. Map each stage to the lowest-cost test capable of catching its failures.
3. Add positive and negative tests for transformations and verifiers.
4. Use differential execution against a trusted framework or interpreter.
5. Cover static, dynamic, boundary, and invalid shapes.
6. Cover supported dtypes, layouts, quantization modes, and devices.
7. Add representative transformer model families and attention variants.
8. Add randomized or property-based graph generation for high-risk operators.
9. Track historical production/compiler bugs and encode them as regressions.
10. Separate correctness, numerical-quality, compile-time, memory, and performance gates.
11. Keep CI tiers: fast presubmit, broader postsubmit, and hardware-specific suites.
12. Quarantine flaky tests only with an owner and root-cause plan; do not silently disable them.

## Decision points
Prefer semantic assertions over exact IR text unless textual stability is itself a contract. Use expensive full-model tests selectively while keeping broad pass-level coverage fast. Gate performance only where benchmark variance is controlled.

## Common failure patterns
- Relying only on end-to-end models.
- Golden tests that fail on harmless formatting changes.
- No negative tests for illegal transformations.
- Missing dynamic-shape and dtype combinations.
- Treating flaky numerical tests as acceptable noise.

## Verification
Implemented means the suite runs in CI. Verified means intentional defect injection or historical regressions are detected at appropriate layers, the supported configuration matrix is covered, flaky rate is controlled, and performance gates have reproducible thresholds.

## Expected output
A layered compiler test matrix with ownership, reference oracles, CI tiers, regression cases, and explicit coverage gaps.

## Stop conditions
Stop when supported configurations are undefined, no trusted semantic reference exists for critical paths, or required hardware coverage cannot be accessed and the risk cannot be mitigated by lower-level tests.