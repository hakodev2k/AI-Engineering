# Performance Rules

## Purpose
Ensure performance work is evidence-based and protects user experience under realistic load.

## Scope
Applies to latency, throughput, saturation, resource efficiency, and performance regressions.

## MUST
- Performance claims MUST be supported by before-and-after measurements using comparable conditions.
- Critical latency objectives MUST distinguish typical and tail behavior where tail latency matters.
- Investigations MUST identify the constrained resource or path before broad optimization.
- Performance tests MUST document workload, environment, dataset, and measurement method.
- Regressions affecting SLOs or capacity MUST be treated as reliability risks.

## MUST NOT
- MUST NOT optimize solely from code inspection when runtime evidence is available.
- MUST NOT report averages alone when percentiles reveal user-impacting tails.
- MUST NOT trade away correctness, security, or recoverability for unmeasured performance gains.

## SHOULD
- Prefer production-representative workloads and datasets.
- Track performance changes across releases for critical paths.

## Exceptions
Synthetic-only evidence may be used before production when representative production measurement is impossible; limitations MUST be documented.

## Verification
Use benchmarks, load tests, profiles, traces, saturation metrics, percentile dashboards, and release comparisons.