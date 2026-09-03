# Rules: Tool-Call Durability

- Every persisted tool call MUST have exactly one matching terminal result before autonomous resume is allowed.
- A missing result MUST be classified as `indeterminate`, not automatically as failure.
- A missing result MUST NOT be converted to synthetic success.
- Non-idempotent or unknown side-effect calls MUST NOT be retried until external state is reconciled.
- Resume preflight MUST scan for orphan calls, orphan outputs, duplicate calls, and duplicate outputs.
- Corrupt journals MUST NOT be supplied to the model merely because they are syntactically parseable.
- Tool request persistence and terminal-result persistence SHOULD use an atomic/transactional visibility boundary where the storage system supports it.
- If atomic storage is unavailable, the journal MUST expose an explicit pending state that recovery can distinguish from terminal state.
- Event-stream backpressure MUST NOT be allowed to discard the only durable copy of a required terminal tool result.
- Explicit aborted/not-executed markers MUST only be recorded when evidence supports that classification.
- Recovery facts, assumptions, and external reconciliation evidence MUST be recorded separately.
- Maximum automatic reconciliation attempts MUST be 2.
- The implementing component MUST NOT be the sole verifier of a high-risk recovery.
- Completion MUST be blocked until `scripts/tool_journal_guard.py --mode check` returns zero invariant violations.
