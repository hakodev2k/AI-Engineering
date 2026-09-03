# Load Testing Rules

## Purpose
Validate serving behavior under realistic demand before production exposure.

## Scope
Applies to benchmarks, stress tests, soak tests, burst tests, and failure-capacity tests.

## MUST
- Use representative request sizes, sequence lengths, concurrency, streaming behavior, and traffic mix.
- Test beyond expected steady-state demand to locate saturation and failure thresholds.
- Measure latency percentiles, throughput, errors, queueing, memory, accelerator utilization, and recovery.
- Preserve test configuration and results so comparisons are reproducible.

## MUST NOT
- Infer production capacity from single-request microbenchmarks alone.
- Compare benchmark results produced with materially different workloads without disclosing the difference.
- Run destructive stress tests against production without explicit approval and safeguards.

## SHOULD
- Include soak tests for leaks, fragmentation, thermal effects, and degradation over time.
- Exercise dependency failures and replica loss during load.

## Exceptions
Reduced-scope testing requires documented constraints, residual risk, compensating evidence, and release approval.

## Verification
Review workload definitions, benchmark artifacts, dashboards, saturation curves, failure tests, and reproducibility records.