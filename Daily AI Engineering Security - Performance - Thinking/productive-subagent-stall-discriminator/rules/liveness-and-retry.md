# Rules: Liveness and Retry

- A watchdog MUST use at least two independent stale signals before declaring a confirmed stall.
- A watchdog MUST NOT treat a host-generated heartbeat alone as proof of model progress.
- A run with recent tool, protocol, model, or durable-progress activity MUST NOT be killed as stalled.
- Human cancellation MUST NOT be rewritten as timeout; timeout MUST NOT be rewritten as human cancellation.
- Automatic retry MUST be bounded by `max_retries`.
- Retry MUST preserve or explicitly summarize durable progress when resume/checkpoint is available.
- An identical restart SHOULD compare a progress fingerprint first.
- Non-idempotent external side effects MUST NOT be replayed automatically without idempotency evidence.
- Baseline and post-change measurements MUST exist before claiming performance improvement.
- Security and approval boundaries MUST NOT be weakened to avoid watchdog failures.
