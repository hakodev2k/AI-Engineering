# Rules: Agent Watchdog Performance

- A watchdog policy **MUST** be based on measured phase-level latency, not a single arbitrary global constant.
- The system **MUST** distinguish model wait, tool execution, stream reconnect/backoff, and unknown-idle phases when telemetry permits.
- The effective deadline **MUST** be observable, including provider, transport, agent, workflow, and global timers.
- A configured longer timeout **MUST NOT** be silently pre-empted by an undocumented shorter timer.
- Progress/heartbeat signals **MUST** be explicit and **MUST NOT** count meaningless timer ticks as semantic progress.
- A heartbeat **SHOULD** prove transport or task liveness and identify its phase/source.
- Retries **MUST** be bounded and **MUST** have a token/cost amplification budget.
- Effect-bearing tool calls **MUST NOT** be blindly retried unless idempotency or deduplication is proven.
- Performance changes **MUST** capture a before baseline and an after measurement on comparable workloads.
- A timeout increase **MUST NOT** be reported as an improvement unless completion/false-abort metrics improve without unacceptable true-stall detection regression.
- Retry loops **MUST** stop when the configured maximum retry or cost budget is reached.
- Long-running healthy requests **SHOULD** expose progress or resumability state instead of being classified as generic failure.
- Verification **MUST** include tail latency (p95/p99), not averages alone.
