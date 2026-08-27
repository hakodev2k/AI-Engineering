# Rules: Prompt Cache Contract

- Every model/provider route MUST have an explicit cache-capability policy before non-default cache fields are sent.
- Deprecated cache fields MUST NOT be serialized.
- Unsupported TTL values MUST block the request before network execution.
- Explicit breakpoints MUST only be used when the target route documents support.
- Cache-read and cache-write token counters SHOULD be recorded per task when the provider exposes them.
- Cache-write economics MUST be compared with subsequent reads; enabling caching alone MUST NOT be treated as proof of savings.
- Compaction or prompt-reordering changes MUST be benchmarked for prefix stability.
- Retry logic MUST NOT resend an unchanged request that failed deterministic compatibility validation.
- Correctness-critical context MUST NOT be evicted solely to satisfy a token-cost target.
- Any cost optimization MUST preserve or improve representative task success and critical verification coverage.
