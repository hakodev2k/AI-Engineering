# Numerical Precision Rules

## Purpose
Use reduced precision safely while preserving required model quality and numerical stability.

## Scope
FP64, FP32, TF32, BF16, FP16, FP8, integer formats, accumulation, quantization, and mixed precision.

## MUST
- Precision changes MUST be validated against defined accuracy or quality tolerances.
- Accumulation precision MUST be chosen explicitly for numerically sensitive operations.
- Overflow, underflow, NaN, Inf, and loss-scaling behavior MUST be tested where relevant.
- Hardware-specific precision modes MUST be documented in benchmark results.

## MUST NOT
- MUST NOT claim a precision optimization safe solely because execution completes.
- MUST NOT silently change precision semantics across environments.
- MUST NOT trade correctness for throughput without explicit acceptance criteria and approval.

## SHOULD
- SHOULD use the lowest precision that satisfies validated quality and stability requirements.
- SHOULD retain higher precision for sensitive reductions when evidence warrants it.

## Exceptions
Exceptions require quality evidence, bounded risk, and model or application owner approval.

## Verification
Run numerical comparison tests, task-level quality evaluation, anomaly checks, and precision-aware benchmarks.