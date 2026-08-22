# Recovery Safety Rules

## MUST
- Persist a checkpoint before leaving a stage that performed material work.
- Record repository baseline and changed resources when Git is available.
- Record external side-effect identifiers when available.
- Validate checkpoint state before resuming execution.
- Treat implementation completion and verification completion as separate states.
- Use bounded retry counts and persist retry history.
- Require explicit human approval for production deployment, schema changes, destructive actions, secrets/config changes, history rewrite, breaking contracts, and uncertain repeats of non-idempotent actions.
- Preserve failure evidence until the task is verified or explicitly abandoned.

## MUST NOT
- Infer that a lost tool response means the tool action failed.
- Repeat a non-idempotent action whose previous outcome is unknown.
- Mark a stage complete without evidence.
- Mark a task verified merely because code was generated or tests were started.
- Store secrets or authentication tokens in checkpoint files.
- Rewrite checkpoint history to hide failures.
- Continue when checkpoint state conflicts with observable repository state without reconciliation.
- Retry indefinitely.

## SHOULD
- Keep `next_action` singular and executable.
- Prefer durable identifiers such as commit SHA, migration ID, CI run ID, deployment ID, message ID, or resource ID over narrative memory.
- Checkpoint after file edits, successful tests, failed tests, external calls, approval changes, and stage transitions.
- Use idempotency keys or read-before-write checks for external actions when supported.
- Keep checkpoint events concise while retaining evidence needed for recovery.
