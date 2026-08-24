# Load Testing Rules
## Purpose
Produce credible empirical evidence for capacity limits.
## Scope
Benchmark, stress, soak, burst, and failover load tests.
## MUST
- Tests MUST state workload model, data shape, environment differences, success criteria, and safety limits.
- Results MUST report throughput, latency percentiles, errors, saturation, and bottlenecks.
- Production-impacting tests MUST require explicit human approval and abort criteria.
## MUST NOT
- MUST NOT extrapolate beyond tested scale without stating uncertainty.
- MUST NOT compare before/after results from materially different workloads as equivalent.
## SHOULD
- Critical systems SHOULD include sustained tests that reveal leaks or thermal effects.
## Exceptions
Synthetic environments require documented production correction factors.
## Verification
Review test definitions, raw results, environment configuration, and reproducibility.