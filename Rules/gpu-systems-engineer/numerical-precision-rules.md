# Numerical Precision Rules

## Purpose
Control correctness and stability when using reduced precision, mixed precision, approximate operations, and nondeterministic reductions.

## Scope
Floating-point, integer quantization, tensor formats, reductions, accumulators, and numerical kernels.

## MUST
- Precision choices MUST be justified by accuracy/error requirements and validated on representative data.
- Accumulator precision MUST be sufficient for the algorithm's error budget.
- Overflow, underflow, NaN, Inf, and saturation behavior MUST be tested where plausible.
- Changes to precision MUST include quality and performance evidence.

## MUST NOT
- MUST NOT assume numerically close outputs are acceptable without defined tolerances.
- MUST NOT hide precision-induced failures by arbitrarily widening test tolerances.
- MUST NOT enable unsafe fast-math behavior where contractual numerical guarantees depend on stricter semantics.

## SHOULD
- Use higher precision for sensitive reductions or reference paths when cost is justified.
- Document determinism limitations caused by parallel reduction order.

## Exceptions
Approximation is allowed only with explicit error bounds, measured impact, consumer acceptance, and rollback path.

## Verification
Run reference comparisons, adversarial numerical tests, error-distribution analysis, and cross-device validation.