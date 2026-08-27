# Latency and Performance Rules

## Purpose
Control API response-time risk using measurement, budgets, and bottleneck evidence.

## Scope
Applies to request processing, network calls, serialization, queues, storage, and client-visible latency.

## MUST
- Latency objectives MUST use percentile or distribution-based measures appropriate to user impact.
- Performance changes MUST be supported by comparable before/after measurements.
- Critical request paths MUST have an end-to-end latency budget that accounts for downstream calls and retries.
- Investigations MUST identify or bound bottlenecks with profiling, traces, query plans, or equivalent evidence.
- Performance tests MUST represent relevant payload sizes, concurrency, and dependency behavior.

## MUST NOT
- MUST NOT claim improvement from microbenchmarks that do not represent the affected production path.
- MUST NOT optimize by weakening correctness, authorization, durability, or contract guarantees without explicit approval.
- MUST NOT hide tail latency behind averages.

## SHOULD
- Performance regressions SHOULD have automated guardrails where stable benchmarks are practical.
- Payload and round-trip reduction SHOULD be considered before adding infrastructure.

## Exceptions
Exceptions require measured trade-offs, affected SLOs, risk acceptance, and verification plan.

## Verification
Use benchmarks, load tests, profiles, traces, query plans, payload analysis, and production latency distributions.