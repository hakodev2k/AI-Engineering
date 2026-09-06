# Post-compaction Budget Check Hook

## Trigger
After every compression result and after the first subsequent model request.

## Preconditions
Telemetry includes ordered events with before/after prompt tokens, threshold, compression outcome, and request outcome.

## Action
Append normalized events to the turn trace and run the budget checker at the end of the turn or before a max-attempt termination.

## Script/command
`python3 scripts/check_compaction_budget.py --trace runtime/compaction-trace.jsonl --max-failures 3`

## Expected result
Exit code `0` with no unsafe re-arm, no missed re-arm after verified progress, and no consecutive failed/no-progress attempts beyond the configured cap.

## Failure behavior
Exit code `2` blocks a verified-completion claim and records the violation. Exit code `3` indicates invalid telemetry and also blocks verification.

## Blocking
Yes for changes to context-compression retry semantics. The hook MUST NOT automatically weaken token thresholds or discard correctness-critical context.
