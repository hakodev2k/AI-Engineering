# Rules: Resume Integrity

- A resumable child MUST have a stable task identifier and input fingerprint.
- Resume MUST NOT proceed when the current fingerprint differs from the checkpoint fingerprint.
- Every externally visible write MUST be represented in a side-effect ledger with a stable operation identifier when the target supports one.
- A write with unknown outcome MUST NOT be replayed automatically.
- The runtime MUST distinguish `interrupted`, `paused`, `recoverable`, `completed`, and `failed` states.
- Parent completion MUST NOT imply child completion.
- Resume MUST start at the last verified phase, not merely the last emitted message.
- Automated recovery MUST have a bounded retry count; default maximum is 2.
- A write-capable resumed task MUST be verified by an actor other than the implementing/resuming agent.
- Logs SHOULD record interruption cause, checkpoint ID, resume attempt, skipped completed effects, and verification result.
- Recovery MUST NOT weaken sandbox, permission, approval, or test requirements to obtain completion.
