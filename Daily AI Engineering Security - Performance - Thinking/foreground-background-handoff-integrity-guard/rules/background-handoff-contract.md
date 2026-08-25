# Background Handoff Contract Rules

- A performance claim **MUST** have a baseline trace from a comparable workload.
- Every foreground command that can yield/background **MUST** retain one stable `command_id` across lifecycle events.
- An auto-background transition **MUST** produce a correlated acknowledgement before the runtime treats background ownership as established.
- Terminal events **MUST** be idempotent; multiple terminal events for one command are violations.
- Terminal completion **MUST** be followed by a correlated notification/wakeup within the configured deadline.
- Recovery polling **MUST** be bounded to at most two model-visible polls before escalation.
- A runtime **MUST NOT** re-run a command solely because its handoff status is uncertain.
- A runtime **MUST NOT** shorten timeouts or discard output merely to improve measured latency.
- Optimization **MUST NOT** weaken sandbox, approval, cancellation, or permission boundaries.
- The trace auditor **MUST NOT** execute, kill, signal, or mutate observed processes.
- Measurement **SHOULD** use monotonic timestamps or normalized trace timestamps.
- The implementing agent **MUST NOT** be the sole verifier of the post-change trace.
