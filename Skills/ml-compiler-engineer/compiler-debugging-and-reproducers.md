# Compiler Debugging and Reproducers

## Purpose
Reduce compiler crashes, hangs, and miscompilations to minimal deterministic reproducers and identify the responsible transformation or runtime boundary.

## When to use
Use for compiler crashes, invalid IR, wrong-code bugs, nondeterministic failures, backend exceptions, or production compilation incidents.

## Inputs
Failing model/program, inputs, logs, stack trace, IR dumps, compiler flags, environment, revision, target hardware.

## Context to inspect
Inspect graph capture, pass logs, verifier failures, IR before/after suspect passes, generated code, runtime launch metadata, environment/version differences, and nondeterminism.

## Core knowledge
Compiler failures become tractable when the failing state is localized and minimized. Preserve semantic conditions while removing unrelated graph regions, operators, dimensions, and passes.

## Procedure
1. Reproduce the failure under a pinned environment and revision.
2. Classify it as frontend, transformation, codegen, runtime, or numerical wrong-code.
3. Enable IR verification and pass-by-pass dumps around the failing stage.
4. Identify the first stage where behavior or invariants diverge.
5. Minimize the graph while preserving the failure.
6. Reduce shapes, dtypes, attributes, and control flow where possible.
7. Disable passes or bisect pipeline stages to isolate the trigger.
8. Compare with a trusted reference for wrong-code cases.
9. Capture a standalone reproducer with all required flags and inputs.
10. Fix the earliest responsible layer rather than masking downstream symptoms.
11. Add the minimized reproducer as a regression test.

## Decision points
Prefer automated delta reduction when failures are deterministic and the compiler has a reliable predicate. Use revision bisection when stage localization is insufficient. Preserve nondeterministic evidence before changing scheduling or seeds.

## Common failure patterns
Debugging only the final backend error, reducing away the triggering condition, fixing symptoms downstream, relying on unreproducible production state, and failing to retain the regression case.

## Verification
Confirm the minimized case fails before the fix and passes after it, then run broader correctness suites and the original workload.

## Expected output
A minimal reproducer, isolated failing stage/root cause, validated fix, and permanent regression coverage.

## Stop conditions
Stop if the failure cannot be reproduced with available artifacts, required proprietary hardware/runtime is inaccessible, or evidence suggests data corruption outside the compiler boundary.