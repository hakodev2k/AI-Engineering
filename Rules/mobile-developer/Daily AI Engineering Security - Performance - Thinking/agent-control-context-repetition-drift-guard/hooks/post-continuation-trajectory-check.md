# Hook: Post-Continuation Trajectory Check

## Trigger
After every tool/subagent/compaction continuation once the task exceeds the host's long-running threshold.

## Preconditions
The continuation record includes goal ID, subtask ID, control hashes, acknowledgement-only flag, and productive-action flag.

## Action
Append the record to a bounded JSONL trace, then run:

```bash
python3 scripts/control_context_guard.py trace.jsonl --policy config/policy.json
```

## Expected result
Exit `0` means healthy. Exit `3` requires control-context deduplication. Exit `4` requires restoring the approved top-level goal. Exit `5` stops autonomous continuation. Exit `2` indicates invalid instrumentation.

## Failure behavior
Do not continue automatically on exits 2, 4, or 5. Exit 3 permits only a bounded recovery using the documented workflow.

## Blocks completion
Yes when goal drift, low productive progress after recovery, or invalid state remains unresolved.
