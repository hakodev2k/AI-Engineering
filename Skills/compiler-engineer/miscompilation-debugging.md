# Miscompilation Debugging

## Purpose
Systematically isolate and fix cases where compilation succeeds but generated behavior is wrong.

## When to use
Use for wrong-code bugs, optimization-dependent failures, target-specific semantic divergence, or nondeterministic output.

## Inputs
Minimal failing program if available, compiler flags, expected/actual behavior, target details, generated IR/assembly.

## Context to inspect
Pass pipeline, optimization remarks, IR snapshots, verifier output, target lowering, runtime/ABI boundaries, recent changes.

## Core knowledge
Wrong-code bugs require identifying the first stage where semantics diverge. Reducing source, flags, passes, and target features turns a system failure into a local proof obligation.

## Procedure
1. Reproduce deterministically and establish a trustworthy oracle.
2. Minimize source input without losing failure.
3. Bisect optimization level, flags, target features, and pass pipeline.
4. Capture IR before and after the first suspicious transform.
5. State the transform's legality assumptions.
6. Check undefined behavior and runtime/ABI interactions.
7. Fix the violated assumption, not just the symptom.
8. Add minimal regression plus broader near-miss cases.
9. Run differential/conformance suites.

## Decision points
Disable a transform temporarily only when correctness risk is high and root cause needs more time. Prefer pipeline bisection over manual assembly inspection early in triage.

## Common failure patterns
Assuming optimizer is guilty without checking UB, debugging final assembly first, overfitting to one input, fixing pattern matching without legality correction.

## Verification
Original and minimized repros pass; regression fails on old compiler; broad suites and target variants pass.

## Expected output
Root cause, semantic explanation, minimal fix, and regression evidence.

## Stop conditions
Escalate when expected behavior is not defined by the language/ABI or hardware behavior cannot be reproduced reliably.