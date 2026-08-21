# Hook: Pre/Post Compaction State Snapshot

## Trigger
Immediately before compaction and immediately after candidate compacted state is materialized.

## Preconditions
A stable task/session identifier and structured state serializer are available.

## Action
1. Before compaction, serialize the critical state to `pre-state.json` in a non-destructive temporary/audit location.
2. Record a SHA-256 hash and evidence/event cursor.
3. After compaction, serialize the candidate state to `post-state.json`.
4. Run:

```bash
python scripts/compaction_integrity_gate.py \
  --before pre-state.json \
  --after post-state.json \
  --policy config/integrity-policy.json
```

## Expected result
Exit code `0` and JSON output with `decision: allow` and no blocking findings.

## Failure behavior
- Exit `3`: block activation and enter bounded recovery.
- Exit `2`: invalid input/configuration; block completion and repair instrumentation.
- Preserve the last verified pre-state and both hash values for diagnosis.

## Blocks completion
Yes. A failed or skipped gate blocks completion for guarded sessions.