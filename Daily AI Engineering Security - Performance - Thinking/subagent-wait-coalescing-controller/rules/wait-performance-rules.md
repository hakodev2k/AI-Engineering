# Wait Performance Rules

- A performance change MUST begin with measured baseline wait calls, timeout/no-change ratio, model turns, tokens, and end-to-end task duration.
- Identical no-change child-state fingerprints SHOULD be coalesced outside the model loop.
- A timeout with no material state change MUST NOT automatically trigger a full-context reasoning turn.
- Poll intervals MUST use bounded adaptive backoff and MUST reset on material change.
- Terminal, error, cancellation, approval, and security-relevant states MUST bypass coalescing and surface immediately.
- A wait target MUST be validated before another wait call; nonexistent targets MUST be invalidated instead of retried blindly.
- `running` state MUST have a liveness timestamp/lease or equivalent freshness evidence.
- A stale child MUST receive at most one deterministic reconciliation attempt before escalation or stop.
- Full final child messages SHOULD NOT be re-injected into routine roster/status polls when a digest/reference is sufficient.
- Retry loops MUST be bounded to two controller-tuning cycles.
- Improvement MUST be demonstrated with before/after evidence; cached-token labels alone MUST NOT be treated as proof of low cost.
- Optimization MUST NOT sacrifice detection of critical state transitions or correctness of the final task result.