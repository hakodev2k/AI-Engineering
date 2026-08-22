# Multimodal Context Policy

1. Every multimodal compaction MUST record a baseline before optimization.
2. Budgets MUST include text estimate, image count, inline image bytes, duplicate bytes, and post-compaction headroom; estimated image tokens SHOULD be included when reliable.
3. Images MUST NOT be treated as zero-cost solely because a text tokenizer returns zero text tokens.
4. Identical inline payloads SHOULD be deduplicated by a cryptographic digest before relevant unique evidence is evicted.
5. Required/protected visual evidence MUST NOT be removed merely to save tokens, bytes, latency, or storage.
6. Evicted visual evidence SHOULD leave a bounded provenance placeholder or content-addressed reference when the runtime supports it.
7. A compaction MUST leave configured hysteresis below the next automatic-compaction trigger.
8. A compacted state that technically fits but violates required headroom MUST NOT be marked successful.
9. Superseded compaction snapshots SHOULD NOT be replayed into active model context when a newer canonical replacement supersedes them.
10. Before fork/resume, the reconstructed history MUST pass the same budget gate as live history.
11. Optimization MUST compare before/after task quality or acceptance criteria; byte/token reduction alone is insufficient.
12. Optimization loops MUST be bounded to two attempts.
13. Failure MUST NOT be hidden by increasing context limits, removing required evidence, or disabling verification.
14. Reports MUST distinguish measured text/bytes/counts from estimated image-token cost.
15. Completion MUST record Implemented, Measured, and Verified status separately.