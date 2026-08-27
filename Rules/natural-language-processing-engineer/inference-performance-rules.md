# Inference Performance Rules

## Purpose
Meet NLP latency, throughput, memory, and cost targets without unmeasured quality loss.

## Scope
Serving, batching, quantization, compilation, caching, sequence lengths, hardware, and optimization.

## MUST
- Performance targets MUST define workload, latency percentile, throughput, resource, and quality constraints.
- Optimization claims MUST include before/after measurements on representative workloads.
- Quantization, pruning, distillation, or approximation MUST be evaluated for task and critical-slice quality regressions.
- Maximum input/output lengths and overload behavior MUST be explicit.

## MUST NOT
- MUST NOT report average latency alone when tail latency affects the service objective.
- MUST NOT trade away required accuracy, safety, or authorization checks for speed without approval.
- MUST NOT benchmark with unrealistic sequence lengths or batch distributions and present results as production capacity.

## SHOULD
- Profiling SHOULD identify the actual bottleneck before optimization.
- Capacity tests SHOULD include cold starts, concurrency, and memory pressure where relevant.

## Exceptions
Temporary target violations require documented impact, mitigation, monitoring, owner, and expiry.

## Verification
Use repeatable benchmarks, profilers, load tests, quality parity suites, memory measurements, percentile latency dashboards, and cost-per-request comparisons.