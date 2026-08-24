# Performance Rules

## Purpose
Keep backend latency, throughput, resource use, and scalability within evidence-based targets.

## Scope
Request paths, workers, databases, network calls, memory, CPU, serialization, and resource pools.

## MUST
- Performance changes MUST be supported by measurements against a defined baseline.
- Critical paths MUST have latency and throughput objectives appropriate to service requirements.
- Resource-intensive operations MUST be bounded and tested with realistic data volumes.
- Performance investigations MUST use profiling, tracing, query plans, metrics, or equivalent evidence.

## MUST NOT
- MUST NOT claim optimization based solely on code appearance or intuition.
- MUST NOT trade correctness or security for performance without explicit approval and documented risk.
- MUST NOT introduce unbounded memory growth, queue growth, or parallelism.

## SHOULD
- Optimize the dominant bottleneck first.
- Load tests SHOULD include realistic concurrency and dependency behavior.

## Exceptions
Temporary performance debt requires quantified impact, owner, monitoring, and remediation plan.

## Verification
Use benchmarks, load tests, profilers, traces, query plans, saturation metrics, and before/after comparisons.