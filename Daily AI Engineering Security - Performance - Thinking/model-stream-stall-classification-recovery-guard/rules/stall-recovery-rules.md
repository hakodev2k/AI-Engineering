# Stall Recovery Rules

- Runtime MUST record request start, last model chunk, retry state, transport errors, and terminal reason with one request ID.
- Runtime MUST NOT encode watchdog expiry as a human/user interrupt.
- Runtime MUST distinguish pre-first-token silence from mid-stream silence.
- Runtime MUST measure TTFT distribution before changing timeout policy.
- A watchdog MUST NOT cancel while a known bounded transport retry/backoff is active unless the global hard ceiling is reached.
- Fixed timeout expiry MUST be treated as evidence of elapsed time, not proof of deadlock.
- Automatic recovery MUST be limited to one attempt per stall episode.
- Recovery MUST NOT replay state-changing external tools unless an idempotency key or equivalent duplicate-effect guard proves safety.
- Model fallback SHOULD preserve task/checkpoint lineage and record the model change.
- Terminal failure MUST preserve the latest checkpoint and diagnostic trace.
- Operators MUST compare false-abort rate and dead-stream detection latency before claiming improvement.
- Security/approval boundaries MUST NOT be weakened to reduce stall latency.