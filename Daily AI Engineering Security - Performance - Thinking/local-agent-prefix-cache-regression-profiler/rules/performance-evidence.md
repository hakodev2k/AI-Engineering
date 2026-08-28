# Rules: Prefix Cache Performance Evidence
- A cache optimization MUST have a cold and warm/growing-prefix baseline.
- Performance claims MUST include TTFT and cached/reusable-token evidence.
- Exact-repeat tests MUST NOT substitute for append-only multi-turn agent tests.
- Cache hits MUST NOT be considered valid when deterministic equivalence fails.
- Unsafe cache state MUST fall back to recomputation rather than serving potentially incorrect output.
- Hardware, model, sampling parameters, context size and concurrency MUST remain controlled for before/after comparisons.
- Optimization loops MUST be bounded to two retries unless a human explicitly extends them.
- Results SHOULD report p50/p95 TTFT and full-refill rate, not only averages.
