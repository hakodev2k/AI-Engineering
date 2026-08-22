# Hook — Post-Compaction Evidence Check

## Trigger
First planned large file read or expensive command after compaction/resume.

## Preconditions
Evidence index exists or can safely be treated as empty; caller can compute a trustworthy state fingerprint for commands.

## Action
For files:
```bash
python scripts/evidence_index.py check-file --index .ai/evidence-index.json --path "$TARGET_FILE"
```

For command results:
```bash
python scripts/evidence_index.py check-command --index .ai/evidence-index.json --command "$NORMALIZED_COMMAND" --state-fingerprint "$STATE_FINGERPRINT"
```

## Expected result
Exit `0` with `fresh-reference` means reuse metadata/artifact reference is permitted. Exit `2` means missing/stale/invalid and the source must be refreshed. Exit `3` means configuration/environment error.

## Failure behavior
Refresh from the authoritative source. Do not skip required evidence collection because the hook failed.

## Blocks completion
It blocks reuse, not the task. The task may continue by re-reading/re-running authoritative evidence.
