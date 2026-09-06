# Inference Latency and Throughput Rules

## Purpose
Optimize GPU inference for predictable service-level latency and sustainable throughput.

## Scope
Batching, dynamic batching, sequence length, concurrency, queueing, kernel execution, and serving saturation.

## MUST
- Inference benchmarks MUST report latency percentiles and throughput under representative concurrency.
- Queue time, host time, and device execution time MUST be distinguished when diagnosing latency.
- Batching policies MUST define maximum wait, batch limits, and tail-latency impact.
- Saturation tests MUST identify the point where queueing or memory pressure degrades service objectives.
- Optimization changes MUST preserve required model outputs and serving contracts.

## MUST NOT
- MUST NOT report average latency alone for production-critical serving.
- MUST NOT increase batch size solely to improve throughput when tail latency violates requirements.
- MUST NOT benchmark only preloaded steady-state paths if cold-start behavior matters operationally.

## SHOULD
- SHOULD benchmark representative request-size distributions and sequence lengths.
- SHOULD separate model execution from orchestration overhead.

## Exceptions
Exceptions require documented traffic assumptions and service-owner approval.

## Verification
Review load tests, percentile latency data, queue metrics, saturation curves, and serving traces.