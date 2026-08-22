# Engineering Rules

## MUST
- **MUST** treat file content in model/tool context as a versioned snapshot, never as permanently current truth.
- **MUST** capture a content hash for every file whose bytes directly inform a guarded mutation.
- **MUST** perform a CAS freshness check immediately before the mutation boundary.
- **MUST** block the mutation when existence or SHA-256 differs from the captured snapshot.
- **MUST** invalidate the old proposed patch/write when its source snapshot is stale.
- **MUST** re-read stale paths from the real filesystem before generating a replacement proposal.
- **MUST** preserve unrelated newer changes unless the task explicitly authorizes replacing them.
- **MUST** bound reconciliation retries; default maximum is 2.
- **MUST** record stale detections, retry count, and final verification status without logging sensitive file contents unnecessarily.
- **MUST** independently re-read and verify final disk state after a successful high-risk write.
- **MUST** require human approval when the refreshed state creates a semantic conflict whose correct resolution cannot be derived from task requirements.
- **MUST** include paths that are expected not to exist: creation is also subject to CAS so another actor's newly-created file is not overwritten.

## MUST NOT
- **MUST NOT** downgrade a stale CAS result to a warning and continue writing.
- **MUST NOT** retry the same patch after a stale failure without rebuilding it from refreshed evidence.
- **MUST NOT** use mtime alone as the authoritative version token.
- **MUST NOT** assume `git status` or `git diff` by itself proves the file still matches the agent's read snapshot.
- **MUST NOT** overwrite a whole file to implement a small change when a narrow edit is sufficient and safer.
- **MUST NOT** discard user or other-agent edits merely because they were absent from the original snapshot.
- **MUST NOT** run unlimited edit/re-read/retry loops under active contention.
- **MUST NOT** let the implementation agent be the sole verifier for writes affecting security policy, CI/CD, credentials configuration, migrations, deployment manifests, or other high-risk files.
- **MUST NOT** expand access outside the trusted root to make the guard pass.

## SHOULD
- **SHOULD** minimize time and unrelated tool calls between CAS verification and the actual write.
- **SHOULD** prefer narrow patches over full-file rewrites.
- **SHOULD** use worktrees or explicit file ownership to reduce contention when multiple agents are expected to write in parallel.
- **SHOULD** capture metrics for stale-event frequency, reconciliation retries, unexpected diff size, and unrelated-line loss.
- **SHOULD** use OS/file locking as an additional control when all writers participate, but not as a replacement for stale-plan detection.
- **SHOULD** compare final diffs against the refreshed baseline, not the original stale baseline.
- **SHOULD** surface contention as a first-class blocked state rather than fabricate assumptions about who changed the file.
- **SHOULD** keep guard artifacts outside sensitive source paths and exclude them from normal commits unless intentionally retained for audit.

## Observable enforcement checks
1. Every guarded write event has a preceding snapshot ID and successful freshness verification.
2. No write event follows a failed verification for the same proposal ID.
3. Every stale event produces either a refreshed snapshot with a new proposal ID or a stopped/escalated task.
4. Retry count never exceeds policy.
5. Every successful guarded high-risk write has a post-write verification record.
6. Regression fixtures demonstrate 0 committed stale writes and 0 unrelated-line loss.
