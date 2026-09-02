# Performance Overhead Rules

## Purpose
Keep tracing useful without materially degrading application latency, throughput, memory, or resource consumption.

## Scope
Applies to SDKs, exporters, processors, enrichment hooks, serialization, sampling, and collector paths.

## MUST
- Tracing overhead MUST be measured on representative workloads before material instrumentation expansion.
- Export paths MUST use bounded queues, timeouts, and failure behavior appropriate to the application's availability requirements.
- Telemetry backpressure MUST NOT be allowed to cause unbounded application memory growth.
- Production performance claims MUST use before/after measurements rather than assumptions.

## MUST NOT
- MUST NOT perform blocking network export on latency-critical request threads unless explicitly justified.
- MUST NOT add expensive attribute computation for spans that will predictably be dropped when a cheaper decision path exists.
- MUST NOT trade application availability for trace completeness by default.

## SHOULD
- Prefer asynchronous batching and bounded buffering.
- Benchmark high-throughput and failure scenarios, not only normal traffic.

## Exceptions
Exceptions require measured benefit, resource budget, failure-mode analysis, and approval for user-visible risk.

## Verification
Run benchmarks and load tests, inspect CPU, memory, allocation, latency, queue depth, dropped spans, and exporter failure behavior before and after changes.
