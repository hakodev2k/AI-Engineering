# Hook: Pre-Resume Rebinding Check

## Trigger
Immediately before resuming a persisted thread under an execution environment different from the thread's recorded source environment.

## Preconditions
A structured state export and mapping config exist. No side-effecting tool call has started.

## Action
Run:

```bash
python scripts/rebinding_audit.py --state state-export.json --mapping mapping.json --target target-environment.json
```

## Expected result
Exit code 0 and a report containing zero critical findings, zero unmapped critical paths, zero mixed-runtime critical references, and zero unapproved permission expansions.

## Failure behavior
Block resume. Surface exact field paths and classifications. Do not auto-widen permissions or silently discard stale roots.

## Blocks completion
Yes.