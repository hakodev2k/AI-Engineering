# Performance

## Purpose
Ensure performance work is evidence-based and preserves correctness.

## Scope
CPU, memory, allocation, I/O, serialization, contention, binary size, and latency.

## MUST
- Performance claims MUST be supported by reproducible before/after measurements on representative workloads.
- Optimizations MUST preserve correctness and documented safety invariants.
- Critical-path regressions MUST be evaluated against explicit budgets or baselines.
- Allocation and copying changes on hot paths MUST be measured when material.

## MUST NOT
- MUST NOT introduce unsafe code solely for speculative speedups.
- MUST NOT optimize benchmark artifacts that do not represent production behavior.
- MUST NOT trade away bounded resource behavior for average-case speed without risk review.

## SHOULD
- Profile before optimizing and identify dominant costs.
- Use criterion-style benchmarks, flame graphs, allocator metrics, and realistic load tests as appropriate.

## Exceptions
Emergency mitigations may use limited evidence when production impact is active, but follow-up measurement is required.

## Verification
Compare benchmark distributions, profiles, memory metrics, load-test results, and production telemetry where available.