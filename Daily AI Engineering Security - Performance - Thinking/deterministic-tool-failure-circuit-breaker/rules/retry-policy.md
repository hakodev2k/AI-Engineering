# Retry Policy Rules

- Every failed tool call MUST be classified before retry.
- Retry identity MUST include tool name, canonical arguments, and normalized error fingerprint.
- Identical deterministic failures MUST NOT be retried more than once.
- Transient failures SHOULD use bounded exponential backoff with jitter and MUST have a maximum attempt count.
- The default transient maximum MUST be no more than two retries unless a tool-specific policy explicitly overrides it.
- A retry after deterministic failure MUST demonstrate changed arguments, changed dependency state, a different tool/path, or new evidence.
- Side-effecting calls with unknown outcome MUST NOT be blindly retried; state reconciliation or idempotency proof is required first.
- Global max-turn limits MUST NOT be the only retry guard.
- Retry counters MUST be per incident and MUST survive model turns/compaction for the duration of the task.
- Repeated failures MUST be grouped under one incident ID for telemetry.
- The system MUST record attempts, elapsed time, tokens/calls consumed, classification, and stop reason.
- Completion MUST NOT claim success merely because the retry loop stopped.
- Security, approval, validation, and authorization failures MUST NOT be weakened or bypassed to improve throughput.