# Quantization Rules

## Purpose
Control precision reduction so edge deployments gain efficiency without unacceptable accuracy or numerical failures.

## Scope
Post-training quantization, quantization-aware training, integer and mixed precision, calibration, and dequantization paths.

## MUST
- Quantization MUST be validated on representative evaluation data and critical behavioral slices.
- Calibration data MUST reflect production input distributions sufficiently for the chosen method.
- Precision choices MUST be compatible with the target runtime and accelerator.
- Saturation, overflow, unsupported-operator, and fallback behavior MUST be checked.

## MUST NOT
- MUST NOT infer acceptable quality from model size reduction alone.
- MUST NOT reuse unrelated calibration data without evidence it is representative.

## SHOULD
- Prefer mixed precision when it materially protects sensitive layers while meeting resource targets.

## Exceptions
Accepted degradation requires quantified impact, rationale, mitigation, and approval.

## Verification
Inspect calibration provenance, per-slice evaluations, runtime operator reports, numerical tests, and device benchmarks.