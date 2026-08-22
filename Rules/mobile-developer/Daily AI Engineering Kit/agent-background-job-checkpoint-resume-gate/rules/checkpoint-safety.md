# Checkpoint Safety Rules

## MUST
- Persist checkpoints atomically.
- Bind every checkpoint to stable job identity and an input fingerprint.
- Advance the cursor only after the corresponding side effects are durably committed.
- Preserve the last valid checkpoint on failure.
- Record whether committed side effects exist before a retry or resume.
- Limit automatic retries to three attempts.
- Require explicit human approval before replaying a chunk that may contain non-idempotent committed side effects.
- Require human approval for production data deletion, schema changes, irreversible migrations, secret/config changes, infrastructure changes, or breaking API changes.

## MUST NOT
- Resume a checkpoint whose job ID, job type, or input fingerprint does not match.
- Resume a checkpoint marked `completed`.
- Delete a failed checkpoint to make a run appear clean.
- Advance progress before work is committed.
- Guess a cursor after corrupted state.
- Increase permissions or bypass validation to unblock a job.
- Retry validation, permission, business-rule, or identity failures as though they were transient.

## SHOULD
- Prefer primary-key or continuation-token cursors over raw offsets when source ordering can change.
- Make each chunk idempotent or transactional.
- Keep checkpoint metadata free of secrets and sensitive payloads.
- Keep chunks small enough that replay cost and lock duration remain bounded.
- Include processed count, timestamps, and concise failure evidence for observability.
