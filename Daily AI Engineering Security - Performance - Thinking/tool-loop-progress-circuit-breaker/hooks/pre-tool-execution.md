# Hook: Pre Tool Execution

## Trigger
Immediately before every agent tool execution.

## Preconditions
Recent tool history and candidate call are available in JSON form; tool is classified as `read` or `mutate`.

## Action
Run:
`python scripts/progress_guard.py --history <events.jsonl> --candidate <candidate.json>`

## Expected result
Exit 0 with decision `allow`; exit 3 with `recover`; exit 4 with `block`; exit 2 for malformed input.

## Failure behavior
Malformed evidence blocks mutating calls. A `recover` result requires a changed plan before re-evaluation. A `block` result prevents execution.

## Blocking
Yes for exit 2 or 4. Exit 3 pauses execution until a changed candidate is produced.
