# Rules: Deadline and Retry

- Every dispatched tool call MUST have a call ID, monotonic start time, explicit deadline class, attempt number, side-effect class, and idempotency flag.
- Tool arguments MUST be schema-validated before dispatch.
- Sequential and parallel execution paths MUST both enforce deadlines.
- A stale call MUST be cancelled when cancellation is supported and MUST NOT remain silently in `tool` state.
- Consequential or unknown-side-effect calls MUST NOT be auto-retried.
- Automatic retry MUST be limited to proven-idempotent read-only calls and MUST respect both attempt and total wall-clock budgets.
- Retry loops MUST have bounded attempts and a stop condition.
- Deadline changes SHOULD be justified by measured latency distributions, not anecdotal failures.
- Logs MUST include call ID, elapsed time, deadline, attempt and decision, but MUST NOT include secrets.
- Operators MUST receive an actionable escalation when a call cannot be safely retried.
