# Performance and Scalability Rules
## Purpose
Meet runtime and resource targets without compromising correctness.
## Scope
CPU, GPU, memory, storage, network, parallelism, and large experiment campaigns.
## MUST
- Establish representative performance baselines before optimization.
- Measure wall time, throughput, memory, and relevant accelerator utilization for critical workloads.
- Verify optimized implementations preserve numerical results within accepted tolerances.
## MUST NOT
- claim performance improvement without before/after measurements.
- trade away validation checks or determinism silently for speed.
## SHOULD
- Profile bottlenecks before architectural optimization.
## Exceptions
Approximate acceleration requires explicit error and risk bounds.
## Verification
Review profiles, benchmarks, scaling curves, resource metrics, and numerical equivalence tests.