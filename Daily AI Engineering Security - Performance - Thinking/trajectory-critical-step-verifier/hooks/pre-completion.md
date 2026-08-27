# Hook: Pre Completion

## Trigger
Before an agent marks a long-horizon task `done`, `fixed`, or `complete`.

## Preconditions
The run has a trajectory JSONL matching `schemas/trajectory-event.schema.json`; acceptance evidence is available; the maximum unverified span is configured.

## Action
Run:
`python scripts/trajectory_guard.py <trace.jsonl> --max-unverified-steps 5`

Then run the task-specific deterministic acceptance tests referenced by the evidence ledger.

## Expected result
Exit `0` only when there are no unsupported completion claims, unresolved assumptions, or excessive unverified spans. Exit `3` requires independent verification/replan. Exit `2` indicates malformed trace/input.

## Failure behavior
Block completion, preserve the trace, identify the first risk step, and return to the last verified checkpoint. Do not silently convert the block into a warning.

## Blocking
Yes for long-horizon or high-impact work.
