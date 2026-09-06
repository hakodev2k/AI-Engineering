# Stream Liveness Rules

- Performance changes **MUST** capture a baseline before optimization: p50/p95/p99/max duration, retries, model calls, tool calls, and completion rate.
- Transport activity **MUST NOT** automatically count as semantic task progress.
- Heartbeat, ping, and metadata-only events **MUST NOT** reset the semantic-progress deadline unless the application explicitly proves they advance task state.
- Every stream **MUST** have an overall task deadline independent of read/semantic timers.
- Recovery **MUST** be bounded; default maximum is two attempts.
- Non-idempotent tool effects **MUST NOT** be automatically replayed merely because a stream stalled.
- Retry policy **MUST** account for remaining overall deadline and prior side effects.
- An optimization **MUST NOT** be called successful without measured before/after evidence and quality/completion regression checks.
- The implementer **MUST NOT** be the sole verifier of latency/call-count improvement.
- Timeout thresholds SHOULD be derived from representative traces rather than arbitrary tightening.