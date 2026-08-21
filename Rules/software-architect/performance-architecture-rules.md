# Performance Architecture Rules

## Purpose
Ensure performance decisions are measurable, capacity-aware, and structurally sustainable.

## Scope
Applies to latency, throughput, resource use, caching, concurrency, hot paths, and scalability decisions.

## MUST
- Performance requirements MUST be expressed with measurable targets and representative workloads.
- Architectural performance claims MUST be supported by profiling, benchmarks, load tests, or production evidence.
- Known bottlenecks MUST be analyzed at the correct layer before introducing structural complexity.
- Capacity assumptions MUST include expected growth and saturation behavior.

## MUST NOT
- MUST NOT claim a design is faster or more scalable without evidence.
- MUST NOT introduce caching without ownership, freshness, invalidation, and failure semantics.
- MUST NOT optimize low-impact paths while critical bottlenecks remain unmeasured.

## SHOULD
- Prefer reducing unnecessary work and data movement before adding infrastructure.
- Prefer performance budgets for critical flows.

## Exceptions
Provisional decisions may use estimates when measurements are unavailable, but assumptions and validation plans must be explicit.

## Verification
Use benchmarks, profilers, load tests, query plans, resource metrics, traces, and before/after comparisons.