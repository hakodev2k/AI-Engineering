# Numerical Correctness and Stability

## Purpose
Preserve model quality and numerical behavior while compiler transformations change operation order, precision, fusion, reduction strategy, or backend implementation.

## When to use
Use when adding mixed precision, fusion, fast math, quantization, alternate reductions, new kernels, or investigating output drift after compilation.

## Inputs
- Reference implementation and outputs
- Supported dtypes
- Error tolerances and model-quality metrics
- Candidate compiler transformation
- Representative and adversarial inputs

## Preconditions
Define what numerical equivalence means for the workload. Exact bitwise equality is often unnecessary, but tolerances must not be chosen after seeing failures merely to make tests pass.

## Context to inspect
Inspect reductions, softmax, normalization, exponentials, accumulators, casts, rounding, overflow/underflow, denormals, fast-math flags, quantization boundaries, and nondeterministic kernels.

## Core knowledge
Floating-point operations are not associative. Reordering reductions, changing accumulator precision, using approximate transcendental functions, or fusing operations can alter outputs. Local tensor error may amplify through autoregressive generation, so both component-level and end-task checks matter.

## Procedure
1. Establish trusted reference execution.
2. Define absolute, relative, ULP, and task-level acceptance criteria where appropriate.
3. Identify numerically sensitive operations in the transformed region.
4. Compare intermediate tensors to localize divergence.
5. Check accumulator precision and cast placement.
6. Test extreme magnitudes, long reductions, masks, and boundary values.
7. Separate deterministic drift from nondeterministic variance.
8. Disable candidate fast-math or fusion features selectively to isolate causes.
9. Add precision promotion or stable algorithms where needed.
10. Validate end-model perplexity, logits, ranking, or generation metrics as appropriate.

## Decision points
Use higher-precision accumulation for reductions when accuracy loss is material. Allow fast math only when measured quality remains inside a predeclared budget. Prefer stable softmax/normalization forms over algebraically simpler but overflow-prone versions.

## Common failure patterns
- Setting excessively loose global tolerances.
- Comparing only final tokens and missing systematic logit drift.
- Ignoring low-probability overflow cases.
- Mixing nondeterminism with compiler error.
- Assuming lower precision is safe because average error is small.

## Verification
Implemented means the transformed model runs. Verified means tensor-level tests, adversarial numerical cases, and defined end-task quality metrics all remain inside the approved budget across supported hardware and dtypes.

## Expected output
A documented numerical contract, localized error analysis, stability safeguards, and regression tests.

## Stop conditions
Stop when no trusted reference exists, the accuracy budget is undefined, or observed drift can materially change model behavior without product/model-owner approval.