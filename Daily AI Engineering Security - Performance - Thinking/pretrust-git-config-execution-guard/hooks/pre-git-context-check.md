# Hook: Pre-Git Context Check

## Trigger
Immediately before first Git subprocess.
## Preconditions
Repository path known; no stale trust decision after `.git/config` change.
## Action
Run static scanner; block non-zero.
## Script/command
`python scripts/git_pretrust_guard.py "$REPOSITORY_PATH" --json`
## Expected result
Exit 0, decision `safe`.
## Failure behavior
Exit 2 or 3 stops and surfaces structured result.
## Blocking
Yes.