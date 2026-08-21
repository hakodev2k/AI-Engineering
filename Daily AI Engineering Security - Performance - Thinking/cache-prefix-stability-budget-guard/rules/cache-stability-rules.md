# Rules: Cache Prefix Stability

1. Every cache optimization **MUST** begin with measured baseline input tokens, cache-read/cache-write tokens when available, latency, and task quality.
2. Stable prompt/tool segments **MUST** use deterministic ordering and serialization when cache reuse depends on prefix equality.
3. Volatile fields such as timestamps, request IDs, latest tool output, and latest user input **SHOULD** appear after stable reusable content unless semantics require otherwise.
4. The harness **MUST** record the first changed prefix segment between adjacent agent steps.
5. Cache-hit improvement **MUST NOT** be claimed from configuration alone; post-change provider telemetry or equivalent measured evidence is required.
6. Required security, authorization, evidence, and task context **MUST NOT** be removed merely to reduce token count or increase cache ratio.
7. Tool catalogs **SHOULD** expose only capabilities relevant to the current task when safe routing/deferred discovery preserves required capability.
8. Tool schemas **MUST** be sorted deterministically when provider matching is prefix-sensitive.
9. Dynamic text **MUST NOT** be injected into stable tool descriptions or policy blocks when it can be placed in the runtime suffix.
10. Cache-write economics **MUST** consider expected reuse count and current provider pricing/telemetry; the system **MUST NOT** assume writes are free.
11. An optimization **MUST** fail verification if task quality regresses beyond `config/cache-policy.json`, even when token or latency metrics improve.
12. Token, latency, and cache metrics **MUST** compare equivalent representative workloads.
13. Optimization loops **MUST** be bounded to two cycles before escalation or acceptance of the measured baseline.
14. Missing cache telemetry **MUST** be reported as unavailable, not estimated as a hit or miss.
15. The implementation owner **MUST NOT** be the only verifier of a production cache-layout change.