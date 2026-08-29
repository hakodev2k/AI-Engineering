# Quantization Rules

## Purpose
Control accuracy, compatibility, memory, latency, and operational risks introduced by lower-precision inference.

## Scope
Applies to weight-only and activation quantization, mixed precision, calibration, conversion, quantized kernels, and quantized model deployment.

## MUST
- Quantization decisions MUST specify target precision, method, hardware, runtime, and expected memory or latency benefit.
- Quantized artifacts MUST be evaluated against an accepted reference model on task-relevant quality metrics and representative prompts.
- Calibration-dependent methods MUST use documented, representative, and legally permitted calibration data.
- Before production rollout, quantized models MUST be tested for numerical instability, output degradation, context-length effects, and kernel compatibility.
- Claimed performance gains MUST include before-and-after measurements under equivalent load and hardware conditions.
- Material quality regressions MUST be explicitly accepted by the responsible product or model owner.

## MUST NOT
- MUST NOT deploy a quantized model solely because it fits memory.
- MUST NOT compare latency using different batching, context distributions, or generation lengths without disclosing the difference.
- MUST NOT silently replace full-precision or higher-precision models with quantized variants when quality or safety behavior can change.
- MUST NOT treat perplexity alone as sufficient evidence for all user-facing workloads.

## SHOULD
- Quantization SHOULD be evaluated per model family and deployment workload rather than generalized from unrelated models.
- Mixed precision SHOULD preserve sensitive layers or operations when evidence shows meaningful quality benefit.

## Exceptions
Exceptions require documented benefit, measured degradation, risk assessment, fallback plan, and approval when user-visible quality or safety changes materially.

## Verification
Inspect conversion parameters, calibration records, artifact manifests, benchmark reports, quality evaluation results, and rollout approval. Re-run representative comparisons where reproducibility is required.