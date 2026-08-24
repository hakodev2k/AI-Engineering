# Hook: Pre-Resume Materialization Budget

## Trigger
Before resuming/forking a large transcript or spawning multiple children from a multimodal parent.

## Preconditions
Transcript is readable and budget config exists.

## Action
`python scripts/transcript_profile.py <session.jsonl> --budget config/budgets.json`

## Expected result
Exit `0` and `status=PASS`.

## Failure behavior
Exit `2` blocks automatic resume/fan-out and invokes bounded recovery. Exit `1` indicates invalid input and also blocks automation.

## Blocks completion
Yes when the target host has finite resource constraints.