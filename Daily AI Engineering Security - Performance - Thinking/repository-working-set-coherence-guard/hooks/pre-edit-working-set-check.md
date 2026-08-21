# Hook: Pre-Edit Working-Set Check

## Trigger
Immediately before a source-code edit batch or context compaction.

## Preconditions
`manifest.json` reflects the current repository ref and `config/policy.json` is available.

## Action
Run:
`python scripts/working_set_guard.py manifest.json --policy config/policy.json`

## Expected result
Exit code `0` and `decision=allow` with required-fact coverage at policy threshold.

## Failure behavior
Exit `2`: input/config error, fix the manifest or policy. Exit `3`: block the edit, refresh missing/stale facts or safely reduce duplicate/non-required context, then rerun within the bounded workflow retry budget.

## Blocks completion
Yes. A blocked or invalid working set cannot be used as evidence for a verified edit.