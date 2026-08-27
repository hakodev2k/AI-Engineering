# Rules: Tool Result Reuse

- Every cacheable tool MUST have documented read-only/idempotent semantics.
- Side-effecting tools MUST NOT be cached or replayed from a prior success response.
- Cache keys MUST include tool identity plus canonicalized arguments.
- Cache scope MUST be explicit and MUST NOT cross tenant/user boundaries without a documented security review.
- TTL MUST be derived from freshness requirements, not convenience.
- A changed output digest MUST be treated as fresh evidence that reuse assumptions may be invalid.
- Baseline duplicate-call and latency metrics MUST be collected before enabling reuse.
- Performance improvement MUST be measured after enabling reuse; claims without before/after evidence MUST NOT be accepted.
- Cached results SHOULD be represented compactly to avoid re-injecting duplicate payloads into context.
- Correctness-critical freshness MUST override latency or API-cost savings.
- Retry or loop logic SHOULD consult the reuse registry before issuing an identical read-only external call.
