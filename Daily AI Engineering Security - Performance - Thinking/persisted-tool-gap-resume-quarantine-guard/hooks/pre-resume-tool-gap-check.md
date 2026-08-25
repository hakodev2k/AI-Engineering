# Hook: Pre-Resume Tool-Gap Check

## Trigger
Before the first model turn after thread/session resume, especially after runtime or app-server restart.

## Preconditions
A persisted JSONL history snapshot is available and immutable for the duration of the check.

## Action
Run `python scripts/tool_gap_guard.py session.jsonl`.

## Expected result
Exit `0` means no structural call/result anomaly was found. Exit `20` means the thread is quarantined and must follow the recovery workflow. Exit `2` means evidence could not be parsed and normal resume is blocked.

## Failure behavior
Do not continue by deleting malformed events or synthesizing results. Preserve the original history and collect evidence. Evidence collection may be retried at most twice.

## Blocks completion
Yes. Any unresolved gap, orphan result, duplicate call ID, or parse error blocks normal resume until recovery is independently verified.
