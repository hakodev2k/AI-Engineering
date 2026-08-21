# Rules — Replay-aware Retry Policy

- Every retry MUST have a bounded attempt budget.
- Retry policy MUST also bound replayed tokens, post-failure tool calls, and post-failure wall time when these metrics are available.
- A retry MUST record a normalized request fingerprint and progress/checkpoint identifier.
- Identical requests with no new progress MUST NOT be retried indefinitely.
- Deterministic or repeated protocol/schema failures SHOULD require request/state mutation or escalation before another expensive model call.
- Full-turn replay MUST NOT occur when a newer safe checkpoint can resume the task.
- Full-turn replay SHOULD require an explicit checkpoint and replay-cost estimate.
- Exponential backoff MUST NOT be treated as sufficient protection against duplicate expensive work.
- Parent and child retry budgets SHOULD be coordinated so nested retries cannot multiply beyond the intended global budget.
- A provider SDK automatic retry MUST be included in effective attempt accounting where observable.
- Retry decisions MUST log failure class, request fingerprint, checkpoint/progress delta, attempt count, replayed tokens, tool calls, wall time, and decision reason.
- Logs MUST NOT contain secrets or sensitive prompt content that is unnecessary for diagnosis.
- Baseline measurements MUST be captured before changing retry behavior.
- Performance improvement MUST NOT be claimed without before/after evidence.
- Recovery tests MUST include one deterministic repeated failure and one genuinely transient failure.
- Failure after the configured retry/remediation budget MUST escalate or stop; budgets MUST NOT be silently expanded.
- Security, correctness, or verification checks MUST NOT be weakened to reduce replay cost.
