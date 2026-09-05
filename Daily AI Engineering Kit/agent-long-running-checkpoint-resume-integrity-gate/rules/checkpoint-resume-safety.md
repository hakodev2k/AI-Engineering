# Checkpoint / Resume Safety Rules

## MUST
- Bind checkpoints to exact task identity and scope hash.
- Record repository HEAD, working-tree state, diff hash, stage, next action, and checkpoint time.
- Recompute current state before every resume.
- Treat expired approvals as invalid.
- Re-read relevant repository context after a successful deterministic gate.
- Preserve failed resume reports for incident/debug evidence.
- Independently verify high-risk resumed work.

## MUST NOT
- Resume from a checkpoint solely because the file parses.
- Change checkpoint hashes to make current state match.
- Automatically renew or extend human approvals.
- Resume approval-gated dangerous actions after approval expiry.
- Ignore branch drift because local files appear unchanged.
- Persist secrets in checkpoint JSON.
- Retry until success.
- Force push, deploy production, mutate infrastructure, delete data/files, change secrets, weaken security, or perform irreversible migrations without explicit current approval.

## SHOULD
- Keep checkpoint next actions small and deterministic.
- Prefer restarting exploration when repository drift is broad.
- Include evidence paths rather than embedding large logs.
- Use a stable environment fingerprint for non-interchangeable workers.
