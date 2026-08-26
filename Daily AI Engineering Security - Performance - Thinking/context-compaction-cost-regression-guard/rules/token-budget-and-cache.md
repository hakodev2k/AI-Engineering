# Rules: Token Budget and Cache Integrity

- A compaction change MUST have a measured baseline using a comparable workload.
- Post-compaction token count MUST be recorded and MUST NOT be treated as improved solely because a compaction event completed.
- Cached and uncached input MUST be measured separately when provider telemetry exposes them.
- Stable prompt segments SHOULD remain byte-for-byte stable across normal turns and compaction where provider semantics permit.
- Large tool, agent, IDE, repository, or attachment payloads MUST NOT be reintroduced immediately after compaction without measuring their token impact.
- A second compaction inside the configured minimum-turn window MUST be treated as potential thrashing and investigated.
- Critical task markers MUST survive compaction; token savings MUST NOT delete requirements needed for correctness or safety.
- Missing telemetry MUST block performance claims.
- Benchmark fixtures MUST NOT contain secrets or production-sensitive data.
- Automated optimization loops MUST stop after one corrective retry and hand off unresolved regressions for review.
