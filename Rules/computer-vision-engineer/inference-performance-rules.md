# Inference Performance Rules

## Purpose
Ensure vision inference meets measured latency, throughput, memory, and compute requirements on target hardware.

## Scope
Preprocessing, model execution, postprocessing, batching, accelerators, memory transfers, and end-to-end pipelines.

## MUST
- Performance claims MUST use target or representative hardware and realistic input shapes, concurrency, and pipeline stages.
- Optimization MUST include before/after measurements with accuracy and numerical-impact checks.
- Tail latency and resource peaks MUST be measured when they affect service or real-time requirements.
- Performance budgets MUST include preprocessing and postprocessing, not model execution alone.

## MUST NOT
- Warm-cache microbenchmarks MUST NOT be represented as end-to-end production latency without qualification.
- Quantization, pruning, fusion, or compilation MUST NOT be promoted without task-quality regression evaluation.

## SHOULD
- Bottlenecks SHOULD be profiled before optimization effort is committed.

## Exceptions
Prototype estimates may use proxy hardware if clearly labeled and followed by target-device validation before release.

## Verification
Run reproducible benchmarks, profilers, load tests, memory measurements, accuracy comparisons, and target-device tests.