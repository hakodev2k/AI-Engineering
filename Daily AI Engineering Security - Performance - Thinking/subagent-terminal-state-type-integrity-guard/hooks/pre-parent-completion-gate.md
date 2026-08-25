# Hook: Pre-Parent-Completion Gate

## Trigger
Before a parent marks any delegated task, milestone, or overall job complete.

## Preconditions
All child terminal events for the current dispatch are exported to normalized JSONL.

## Action
Run:
```bash
python scripts/subagent_status_guard.py "$SUBAGENT_TERMINAL_EVENTS" --json "$SUBAGENT_TERMINAL_REPORT"
```

## Expected result
Exit `0`; no unsupported success claim. The parent additionally checks that every required child is represented and has the workflow-required classification.

## Failure behavior
Exit `2` blocks parent completion and surfaces violation codes. Exit `3` blocks because terminal evidence could not be validated. The hook MUST NOT auto-rerun children or coerce their state.

## Blocks completion
Yes. Reconciliation is bounded to two attempts. Dangerous or irreversible replay requires explicit human approval.