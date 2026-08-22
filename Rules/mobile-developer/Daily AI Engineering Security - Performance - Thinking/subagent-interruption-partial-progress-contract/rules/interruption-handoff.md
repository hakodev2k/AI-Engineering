# Interruption Handoff Rules

- Every non-clean subagent termination MUST produce a structured partial-progress envelope.
- The parent MUST NOT infer “the child did nothing” solely from missing final text.
- A terminal envelope MUST distinguish known causes such as human cancellation, permission rejection, watchdog timeout, quota exhaustion, API failure, process kill, and parent shutdown.
- `user_cancelled` MUST NOT be asserted unless a human cancellation event is actually evidenced.
- The envelope MUST include start/end time, tool-call count, last action, known side effects, incomplete step, and evidence pointer.
- Known durable checkpoints SHOULD be included so recovery can resume rather than repeat.
- If side effects exist or state is uncertain, the parent MUST verify current state before retrying.
- A retry MUST NOT repeat irreversible or externally visible actions without idempotency evidence or human approval.
- Recovery loops MUST be bounded by `max_recovery_retries`.
- The parent MUST surface uncertainty when evidence is incomplete instead of converting unknown state into a confident conclusion.
- The system MUST NOT require or persist hidden chain-of-thought; operational events and concise progress facts are sufficient.
- Headless completion MUST NOT report overall success while required child work remains outstanding or lacks a valid completion/partial-progress envelope.
