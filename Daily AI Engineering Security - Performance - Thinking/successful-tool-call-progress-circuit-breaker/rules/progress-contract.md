# Rules: Tool Progress Contract

- Every tool call MUST have a canonical `(tool, args)` fingerprint before execution.
- Successful call fingerprints MUST be retained for the current task.
- Repeated read-only calls SHOULD replay a prior successful result after the configured threshold.
- Mutating calls MUST NOT be replayed or suppressed as duplicates without explicit idempotency semantics.
- Repeated mutating calls beyond threshold MUST require review.
- Polling tools MUST define an observable progress key, interval, or terminal condition.
- Agent loops MUST have a bounded hard stop even when a semantic progress gate exists.
- Performance improvement MUST NOT be claimed without before/after measurement.
- An independent verifier SHOULD validate regression fixtures.
