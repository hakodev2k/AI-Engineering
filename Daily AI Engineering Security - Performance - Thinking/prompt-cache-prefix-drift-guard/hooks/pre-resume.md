# Hook: Pre Resume

## Trigger
Immediately before submitting the first model request for a resumed session.

## Preconditions
The last cache-hitting prompt-block snapshot and rebuilt candidate snapshot are available.

## Action
Run:
`python scripts/prefix_drift_guard.py --before baseline.json --after candidate.json`

## Expected result
Exit 0 for stable or explicitly approved drift; exit 3 for policy-blocked drift.

## Failure behavior
Do not submit the model request. Surface the estimated recache exposure and first changed block index. Preserve only hashes in logs.

## Blocks completion
Yes when drift exceeds policy without approval.
