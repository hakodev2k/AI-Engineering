# Model Optimization Rules

## Purpose
Reduce compute cost without silently changing model semantics or unacceptable task quality.

## Scope
Quantization, pruning, distillation, compilation, operator fusion, reduced precision, and architecture simplification.

## MUST
- Each optimization MUST be evaluated against an approved baseline on representative data.
- Numerical differences MUST be assessed at task-output level, not only tensor similarity.
- Calibration data for post-training quantization MUST represent expected input distributions.
- Optimized artifacts MUST retain traceability to the source model and toolchain.

## MUST NOT
- Unsupported precision or operators MUST NOT be enabled merely because conversion succeeds.
- Optimization gains MUST NOT be reported without including accuracy, latency, memory, and hardware context relevant to the goal.

## SHOULD
- Optimization SHOULD target measured bottlenecks and deployment budgets.

## Exceptions
Exploratory optimization may use reduced evaluation, but cannot be promoted until full acceptance checks pass.

## Verification
Compare baseline and optimized metrics, per-class errors, numerical outputs, profiler results, artifact metadata, and target-runtime tests.