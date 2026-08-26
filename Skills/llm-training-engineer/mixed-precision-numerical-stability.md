# Mixed Precision and Numerical Stability

## Purpose
Train efficiently in reduced precision while detecting overflow, underflow, unstable reductions, and silent numerical corruption.

## When to use
Use for BF16/FP16/FP8 or mixed-precision training and when NaNs, loss spikes, or cross-hardware discrepancies occur.

## Inputs
Precision policy, hardware, kernels, optimizer settings, logs, gradient statistics, reference run.

## Context to inspect
Master-weight precision, reductions, softmax/norm implementations, loss scaling, optimizer states, initialization, fused kernels, and checkpoint conversion.

## Core knowledge
Different operations have different numerical sensitivity. BF16 has wider exponent range than FP16; FP8 requires explicit scaling strategy. Silent finite-but-wrong values can be more dangerous than obvious NaNs.

## Procedure
1. Define precision per operation/state explicitly.
2. Establish a higher-precision or known-good reference on a small workload.
3. Enable finite-value checks at critical boundaries.
4. Log loss scale, overflows, gradient/update norms and activation statistics.
5. Bisect unstable layers or kernels when anomalies appear.
6. Compare fused and unfused implementations if needed.
7. Test checkpoint save/restore under the same precision policy.
8. Validate quality at matched tokens against reference.
9. Record hardware and library versions.

## Decision points
Keep numerically sensitive reductions in higher precision. Prefer BF16 when supported and FP16 overflow is problematic. Adopt FP8 only when throughput gains survive quality and stability validation.

## Common failure patterns
Treating all ops identically; disabling checks for speed too early; blaming data before testing kernels; changing precision and optimizer simultaneously; ignoring finite divergence.

## Verification
No unexplained non-finite values, reference deltas are bounded, resumed runs match expected trajectories, and throughput gains are measured without quality regression.

## Expected output
A documented precision policy, stability diagnostics, reference comparison, and accepted error bounds.

## Stop conditions
Stop on silent corruption, unresolved NaNs, checkpoint incompatibility, or quality loss beyond guardrails.