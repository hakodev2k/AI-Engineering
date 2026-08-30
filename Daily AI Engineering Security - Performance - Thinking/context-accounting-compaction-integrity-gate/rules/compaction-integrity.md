# Compaction Integrity Rules

1. Context-window decisions **MUST** use an explicitly typed current-occupancy metric.
2. Cumulative billing/run usage **MUST NOT** be treated as current context occupancy.
3. Cache read/write accounting **MUST NOT** be added to occupancy unless the provider contract explicitly defines that field as unique in-window prompt tokens.
4. Every occupancy snapshot **MUST** record source and freshness.
5. Unknown or stale occupancy **MUST** block destructive automatic compaction; the runtime **SHOULD** fall back to a bounded transcript estimate when available.
6. Compaction decisions **MUST** log window, reserve, accepted occupancy, source, threshold, and reason.
7. A compaction **MUST** measure tokens before and after; “completed” without shrink evidence is insufficient.
8. Reclaim ratio below configured minimum on two consecutive attempts **MUST** open a circuit breaker and stop automatic retries.
9. Automatic compaction loops **MUST** have bounded retries.
10. Context required for correctness, safety, approvals, or current task state **MUST NOT** be discarded solely to reduce cost.
11. Before/after quality **MUST** be evaluated on representative fixtures when changing compaction/accounting logic.
12. The implementation owner **MUST NOT** be the only verifier for a change that can destructively summarize or evict active context.
