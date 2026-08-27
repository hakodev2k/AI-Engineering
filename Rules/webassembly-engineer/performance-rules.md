# Performance Rules

## Purpose
Make WebAssembly performance decisions evidence-based and production-relevant.

## Scope
Applies to startup, compilation, instantiation, execution, host calls, memory, code size, and throughput.

## MUST
- Performance changes MUST be supported by before/after measurements for the affected workload.
- Benchmarks MUST distinguish compilation, instantiation, warm execution, and host-call costs when relevant.
- Regression budgets for critical latency or throughput paths MUST be defined and tested.
- Performance investigations MUST use representative inputs and runtime configurations.
- Optimization that changes semantics or safety guarantees MUST receive explicit review.

## MUST NOT
- Smaller module size MUST NOT be assumed to imply faster execution without measurement.
- Microbenchmarks MUST NOT be presented as production impact without explaining workload relevance.
- Safety checks, validation, or capability controls MUST NOT be removed merely to improve benchmark results.

## SHOULD
- Profile before optimizing.
- Track p50 and tail latency where user-facing latency matters.
- Measure boundary crossings separately when host interaction is frequent.
- Preserve a reproducible benchmark harness in version control.

## Exceptions
Emergency mitigations may precede complete benchmarking when production stability is at risk, but follow-up measurement and rollback criteria are required.

## Verification
Run benchmark suites in controlled environments, inspect profiler data, compare statistical distributions rather than single samples, and validate production telemetry after release.