# Hook: Post-interruption Gate

## Trigger
Immediately after any child/subagent terminates non-cleanly.

## Preconditions
Runtime writes the partial-progress envelope to a known path.

## Action
Validate the envelope before the parent can retry or claim completion.

## Command
```bash
python scripts/validate_partial_progress.py "$PARTIAL_PROGRESS_ENVELOPE" --policy config/policy.json
```

## Expected result
Exit 0 and a recovery recommendation consistent with side-effect state.

## Failure behavior
Exit 4 blocks automatic retry/completion and forces verify-first/escalation. Exit 2 blocks because the evidence contract is malformed.

## Blocking
Yes. This hook does not itself execute recovery actions; it prevents the parent from silently converting incomplete evidence into success.
