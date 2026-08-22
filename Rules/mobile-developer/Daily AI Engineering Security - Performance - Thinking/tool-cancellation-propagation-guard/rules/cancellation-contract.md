# Cancellation Contract Rules

## Scope
These rules apply to every model run, tool call, nested agent, stream, transport request, subprocess, and owned background task started by an agent run.

## Rules
- A run MUST have one stable cancellation identity that can be correlated across all owned resources.
- Every adapter between runner and executable tool MUST propagate cancellation explicitly; it MUST NOT silently drop the signal/token.
- A cancelled run MUST NOT start new non-cleanup work.
- A tool MUST check cancellation before irreversible or externally visible writes when the underlying operation permits it.
- A tool SHOULD use cooperative cancellation first and MUST have a bounded fallback cleanup path when it owns killable resources.
- Subprocess tools MUST track descendants or use an isolation mechanism capable of terminating the owned process tree.
- Stream resume/reconnect paths MUST receive the same cancellation state as the original request.
- Cleanup MUST be idempotent because cancellation, timeout, and host shutdown may race.
- Completion MUST NOT be reported as clean while owned resources remain active beyond the configured grace period.
- Post-cancel tool outputs MUST be marked late and MUST NOT be interpreted as normal successful continuation.
- Cancellation handling MUST preserve audit evidence: run ID, tool ID, timestamps, cancellation reason, cleanup result, and remaining resources.
- Retries after cancellation MUST NOT occur unless a human or higher-level workflow creates a new run identity.
- Tests MUST cover cancellation before tool start, during tool execution, during streaming, during reconnect/resume, during nested-agent execution, and during subprocess descendants.
- Maximum cleanup retries MUST be finite and configurable.

## Default stop conditions
Stop cleanup attempts when any condition holds: all owned resources are quiescent; maximum cleanup retries are exhausted; cleanup requires a destructive action not pre-authorized; or ownership cannot be proven. In the latter cases report `blocked` with evidence rather than claiming success.
