# Hook: Pre-Checkpoint Transcript Gate

## Trigger
Before a session checkpoint is declared resumable; before compacted/replayed history is submitted; before shutdown persistence; immediately before resume.

## Preconditions
Transcript is exported into the journal format or adapted equivalently.

## Action
Run deterministic validation. Do not repair in place.

## Script / command
`python scripts/transcript_guard.py validate <transcript.jsonl>`

If invalid and recovery is authorized, create a separate candidate:
`python scripts/transcript_guard.py repair <transcript.jsonl> <repaired.jsonl>`
then validate the candidate.

## Expected result
Exit 0 with zero unresolved/orphan/duplicate IDs.

## Failure behavior
Exit 2 blocks resumable checkpoint/resume. Exit 1 blocks because the journal could not be parsed safely. Preserve original evidence.

## Blocks completion
Yes.