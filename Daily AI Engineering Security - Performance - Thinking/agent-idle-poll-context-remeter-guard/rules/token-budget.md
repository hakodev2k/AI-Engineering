# Rules: Token-Aware Control Polling

- Every optimization MUST begin with a measured baseline from a representative workload.
- Control-only `wait`/status events SHOULD NOT trigger a model turn unless new state requires reasoning.
- Model-visible polls MUST have a per-task budget and a maximum consecutive no-change count.
- Poll intervals SHOULD back off after consecutive no-change results and MUST remain bounded by the configured maximum.
- Cached-token usage MUST be counted in tokens/task and tokens/useful-state-change metrics.
- Identical tool outputs MUST NOT be re-injected into model context when a durable identity/hash proves they are unchanged.
- Deduplication state MUST survive context compaction or agent reconstruction when the logical task continues.
- Stale-agent termination MUST require observable lifecycle evidence and MUST NOT terminate active irreversible work.
- Context required for correctness MUST NOT be removed merely to reduce tokens.
- Any optimization MUST be rejected when task success or required verification coverage regresses beyond policy tolerance.
- Retry loops MUST be bounded to at most 2 optimization iterations before escalation.
