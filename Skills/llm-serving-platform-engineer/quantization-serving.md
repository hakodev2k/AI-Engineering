# Quantization Serving

## Purpose
Deploy quantized LLMs with controlled quality loss and verified memory, latency, throughput, and compatibility gains.

## When to use
Use when accelerator memory, cost, or throughput is limiting and a supported quantization path exists.

## Inputs
Baseline model, evaluation set, quantization format/method, runtime kernels, target hardware, serving SLOs.

## Context to inspect
Model config, tokenizer, calibration data, kernel support, hardware capabilities, artifact metadata, and quality/performance baselines.

## Core knowledge
Weight-only and weight-activation quantization trade precision for memory bandwidth and compute efficiency. Effective gains depend on kernel/hardware support; nominal bit width does not guarantee faster inference. Quality sensitivity varies by model and task.

## Procedure
1. Establish full-precision quality and serving baselines. 2. Choose formats supported end-to-end. 3. Use representative calibration data when required. 4. Produce immutable quantized artifacts with provenance. 5. Run correctness and task evaluations. 6. Benchmark TTFT, TPOT, throughput, memory, and power/cost. 7. Test long context and concurrency. 8. Compare quality deltas against acceptance thresholds. 9. Canary before broad rollout. 10. Preserve rollback artifacts.

## Decision points
Choose the least aggressive quantization that achieves the resource goal. Reject a smaller artifact when kernels make it slower or quality regression exceeds business tolerance.

## Common failure patterns
Comparing different prompts, trusting synthetic quality metrics alone, unsupported kernels falling back silently, tokenizer mismatch, and measuring file size instead of runtime memory.

## Verification
Require reproducible evaluation and serving benchmarks against the same baseline plus canary telemetry.

## Expected output
A validated quantized serving artifact, benchmark report, quality delta, and rollout decision.

## Stop conditions
Stop when evaluation coverage is inadequate, runtime support is ambiguous, or quality acceptance thresholds are undefined.