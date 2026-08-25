# Hook: Pre-Action Provenance Gate

## Trigger
Immediately before a tool call classified as privileged: credential use, production mutation, repository push/merge, account/permission change, destructive command, or external data publication.

## Preconditions
The host can export the model-visible authorizing context in normalized JSONL.

## Action
Run:

```bash
python scripts/provenance_guard.py "$CONTEXT_EVENTS_JSONL" --json "$PROVENANCE_REPORT"
```

## Expected result
Exit `0` and zero blocking violations.

## Failure behavior
Exit `2` blocks the action and records violating event IDs. Exit `3` blocks because provenance could not be validated. The hook MUST NOT rewrite events or auto-approve them.

## Blocks completion
Yes for privileged actions. A human security owner may resolve provenance evidence, but MUST NOT bypass the check merely because the requested operation is convenient.