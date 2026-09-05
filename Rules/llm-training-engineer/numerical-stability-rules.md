# Numerical Stability Rules

## Purpose
Prevent silent numerical degradation, divergence, and invalid checkpoints.

## Scope
Precision formats, loss scaling, gradients, optimizer states, normalization, logits, and distributed reductions.

## MUST
- Training MUST monitor non-finite losses, gradients, parameters, optimizer states, and abnormal norm growth where observable.
- Mixed-precision policy MUST be explicit and validated for the chosen architecture and hardware.
- Gradient clipping or stabilization mechanisms MUST have documented thresholds and observed activation rates when used.
- A run showing unexplained numerical anomalies MUST be investigated before its checkpoints are promoted.
- Stability changes MUST be evaluated for convergence and final-quality impact, not merely absence of crashes.

## MUST NOT
- MUST NOT silently replace NaN/Inf values and continue as if training were valid.
- MUST NOT suppress overflow warnings without evidence that the behavior is expected and bounded.
- MUST NOT claim two precision modes are equivalent without comparative evidence.

## SHOULD
- Critical tensors SHOULD have sampled distribution and norm telemetry.
- New kernels or precision modes SHOULD receive parity checks against a trusted reference on representative steps.

## Exceptions
Known benign anomalies require documented mechanism, bounded impact, and a regression test.

## Verification
Review non-finite counters, norm telemetry, loss-scaling logs, precision configuration, kernel parity tests, convergence curves, and checkpoint validation results.