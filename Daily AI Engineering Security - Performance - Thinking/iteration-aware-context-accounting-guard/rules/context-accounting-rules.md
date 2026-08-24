# Context Accounting Rules

1. Billing usage and context-window occupancy **MUST** be represented as separate quantities.
2. Multiple full-context `message` iterations in one request **MUST NOT** be summed to estimate final context occupancy.
3. When per-iteration detail exists, final occupancy **SHOULD** use the last model-message iteration plus only demonstrably unreported local additions.
4. Historical reasoning **MUST NOT** be added locally when provider usage already includes it.
5. A missing inclusion flag **MUST NOT** automatically mean `not included`; ambiguous provenance **MUST** be surfaced.
6. Model, provider, transport, and accounting-rule version **MUST** be recorded with measurements.
7. Auto-compaction changes **MUST** be replayed against immutable traces before release.
8. A token optimization **MUST NOT** remove security constraints, approvals, required evidence, or task-critical context.
9. Improvement claims **MUST** include tokens/task, compactions/task, latency/cost where available, and result-quality/context-loss checks.
10. Parsing/mapping retries **MUST** be bounded to two.
11. The implementer **MUST NOT** be the sole verifier of changed compaction decisions.
12. Thresholds **MUST NOT** be raised to hide accounting defects.