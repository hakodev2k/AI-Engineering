# Compiler Debugging and IR Inspection

## Purpose
Systematically isolate failures across frontend import, transformation passes, lowering, code generation, and runtime execution in an LLM compiler.

## When to use
Use when compilation crashes, generated IR becomes invalid, outputs diverge, a backend fails only after a certain pass, or performance changes unexpectedly after transformation.

## Inputs
- Failing model or minimized graph
- Compiler logs and IR dumps
- Pass pipeline
- Reference outputs
- Runtime/backend errors

## Preconditions
Reproduce the issue deterministically where possible and record compiler version, flags, hardware, model version, and input shape.

## Context to inspect
Inspect pre/post-pass IR, verifier failures, shape metadata, effects, aliases, generated kernels, launch parameters, runtime traces, and recent compiler changes.

## Core knowledge
Compiler bugs often surface far from their cause. The key technique is stage localization: determine the earliest point where semantics, validity, or performance diverges. Pass bisection, IR verification, graph minimization, and reference execution reduce the search space dramatically.

## Procedure
1. Capture a reproducible failing command or test.
2. Classify the failure as import, compile-time validity, codegen, runtime, numerical, or performance.
3. Enable IR dumps and verifiers at stage boundaries.
4. Find the earliest pass after which the failure appears.
5. Bisect or selectively disable passes to isolate the responsible transformation.
6. Minimize the model/graph while preserving the failure.
7. Inspect changed IR invariants, shapes, dtypes, effects, layouts, and aliases.
8. Compare generated code or runtime arguments against a known-good path.
9. Implement the narrowest correct fix.
10. Add a regression test at the lowest useful layer plus an end-to-end test where warranted.

## Decision points
Prefer pass-level regression tests when the bug is a transformation invariant violation. Add model-level coverage when interactions across stages are essential. Avoid masking invalid IR with backend workarounds unless the IR contract explicitly permits it.

## Common failure patterns
- Debugging only the final runtime crash.
- Changing multiple passes before identifying the first divergence.
- Keeping only a huge model reproduction.
- Disabling verifiers to get compilation farther.
- Treating a performance regression as random noise without pass bisection.

## Verification
Implemented means the original reproduction no longer fails. Verified means minimized and full regressions pass, neighboring negative cases remain correct, IR verifiers succeed, and no new backend or performance regressions appear.

## Expected output
A localized root cause, minimal reproduction, narrowly scoped fix, and durable regression coverage.

## Stop conditions
Stop when the failure cannot be reproduced with available inputs/hardware, required generated artifacts are inaccessible, or evidence points to an external runtime/driver defect requiring escalation.