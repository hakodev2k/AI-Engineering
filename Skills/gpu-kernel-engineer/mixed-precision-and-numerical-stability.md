# Mixed Precision and Numerical Stability

## Purpose
Use lower-precision arithmetic and specialized matrix hardware without violating numerical accuracy, convergence, or reproducibility requirements.

## When to use
Use when optimizing ML, linear algebra, simulation, or signal-processing kernels that may benefit from FP16, BF16, TF32, integer, or mixed-precision execution.

## Inputs
Reference implementation, error tolerances, data distributions, target hardware capabilities, accumulation semantics, and benchmark results.

## Context to inspect
Dynamic range, conditioning, accumulation depth, cancellation risk, denormals, rounding modes, tensor/matrix-core requirements, and downstream sensitivity.

## Core knowledge
Lower precision increases throughput and reduces bandwidth, but error depends on scale, conditioning, accumulation order, and conversion points. A Senior engineer separates storage precision, compute precision, and accumulation precision rather than treating precision as one switch.

## Procedure
1. Define acceptable absolute, relative, and application-level error.
2. Identify numerically sensitive operations and long accumulations.
3. Establish a high-precision trusted baseline.
4. Evaluate candidate storage, multiply, and accumulation precisions independently.
5. Add scaling, normalization, compensated accumulation, or selective high precision where required.
6. Check overflow, underflow, saturation, NaNs, and infinities.
7. Benchmark hardware-accelerated precision modes under representative shapes.
8. Validate accuracy across adversarial and extreme-value datasets.
9. Document architecture-specific precision semantics and determinism limits.

## Decision points
Use mixed precision when measured error stays inside the contract. Preserve higher precision in reductions, normalization, or ill-conditioned subexpressions when they dominate error.

## Common failure patterns
Validating only average error; assuming FP16 and BF16 have equivalent behavior; using low-precision accumulation blindly; ignoring overflow; and accepting faster kernels without end-to-end quality evaluation.

## Verification
Compare against the reference with defined tolerances, test extreme values, measure convergence/application metrics, and confirm the intended accelerated instruction path is actually used.

## Expected output
A precision policy with accuracy bounds, fallback rules, and performance evidence.

## Stop conditions
Stop when numerical acceptance criteria are undefined or a precision change can affect regulated/safety-critical decisions without review.