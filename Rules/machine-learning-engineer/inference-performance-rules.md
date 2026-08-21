# Inference Performance Rules
## Purpose
Meet latency, throughput, memory, and cost requirements with evidence.
## Scope
Production inference paths and optimization work.
## MUST
- Define measurable latency, throughput, resource, and cost budgets for production workloads.
- Benchmark representative inputs and concurrency before claiming improvement.
- Measure quality impact when using quantization, pruning, approximation, or smaller models.
## MUST NOT
- Claim performance gains without before-and-after measurements.
- Trade away required prediction quality or safety silently.
## SHOULD
- Optimize the measured bottleneck rather than assumed bottlenecks.
## Exceptions
Emergency mitigations require follow-up measurement and documented risk.
## Verification
Inspect benchmarks, production percentiles, resource metrics, cost data, and quality regression results.