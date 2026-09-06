# Quantization and Precision Rules

## Purpose
Control accuracy, stability, and performance trade-offs introduced by reduced-precision inference.

## Scope
FP32, TF32, BF16, FP16, FP8, INT8, INT4, mixed precision, calibration, and quantized kernels.

## MUST
- Precision changes MUST be validated against representative quality metrics and workload data before production use.
- Quantized models MUST record the quantization method, calibration data assumptions, runtime requirements, and affected layers when relevant.
- Numerical instability, overflow, underflow, and saturation risks MUST be tested for sensitive workloads.
- Performance claims MUST include measured latency, throughput, and memory impact on target hardware.
- Rollout MUST allow comparison with the previously approved precision configuration.

## MUST NOT
- MUST NOT treat lower numerical error on a synthetic tensor test as sufficient evidence of model quality preservation.
- MUST NOT change precision silently under an existing model version when outputs can materially change.
- MUST NOT use unsupported kernels or fallback paths without observability.

## SHOULD
- Prefer the lowest precision that satisfies verified quality and stability requirements.
- Segment validation by important traffic or input cohorts.

## Exceptions
Exceptions require quality evidence, bounded risk, rollback plan, and approval.

## Verification
Inspect evaluation reports, calibration artifacts, numerical tests, benchmark results, and deployment metadata.