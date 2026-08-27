# Hook: Post-Compaction Progress Check

## Trigger
Every three observable actions after a compacted or resumed session.

## Preconditions
Pre-compaction checkpoint and post-compaction event JSONL exist.

## Action
Run:
`python scripts/progress_guard.py --checkpoint checkpoint.json --events events.jsonl --window 3 --max-no-progress-windows 2`

## Expected result
Exit 0 for continued measurable progress.

## Failure behavior
Exit 3 blocks further autonomous repetition and switches to recovery/handoff. Exit 2 blocks verification because input state is invalid.

## Blocking
Yes.
