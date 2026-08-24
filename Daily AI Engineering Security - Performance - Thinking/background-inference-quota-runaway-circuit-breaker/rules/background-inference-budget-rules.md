# Rules — Background Inference Budget

- Every autonomous background model call MUST be associated with a stable worker ID and logical turn ID.
- A worker with `pending_input=false` and `needs_follow_up=false` MUST NOT issue another model call unless an explicit recovery transition creates new work.
- HTTP/model success MUST NOT be treated as evidence of progress without durable state or output change.
- Repeated calls for the same worker/turn MUST have a bounded request budget.
- Unchanged progress fingerprints MUST have a bounded no-progress duration.
- Deterministic failures against unchanged input MUST NOT be retried indefinitely; oversized/unserviceable input MUST transition to a different recovery action.
- Backoff alone MUST NOT be considered a circuit breaker.
- Background usage SHOULD be attributed by feature/worker so idle quota consumption is observable.
- A circuit-break event MUST preserve diagnostic evidence and MUST NOT silently mark the parent task successful.
- Automated recovery MUST be limited to two attempts before escalation.
- Legitimate new input, changed dependency state, or durable progress MAY reset the relevant bounded budget.
- The implementation owner MUST NOT be the only verifier of a guard that can stop autonomous work.
